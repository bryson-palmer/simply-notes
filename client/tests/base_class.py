import time
import sys
import os
import subprocess
import asyncio
from typing import Optional
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.remote.webelement import WebElement
from selenium.common import StaleElementReferenceException

       
class InitVariablesDriver(webdriver.Firefox):

  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    # defines wait_time for each command (before a failure to find an element throws an exception)
    self.wait_time = float(os.environ.get('WAIT', 1))  # this is time waiting for element to be ready
    self.pause_time = float(os.environ.get('PAUSE', 0))  # time to pause before clicking/interacting with element
    self.should_highlight_element = bool(int(os.environ.get('HIGHLIGHT', 0)))


class HighlightElementDriver(InitVariablesDriver):
  should_highlight_element = False

  def get(self, *args, **kwargs):
    ''' getting web page, add CSS for highlighting elements '''
    val = super().get(*args, **kwargs)
    if not self.should_highlight_element:
      return val
    time.sleep(1)  # waiting for webpage to load... TODO figure out better approach
    css = """
    @keyframes briefLightening {
      0%   { filter: brightness(0); }   /* Start at dark */
      15%   { filter: brightness(2); }   /* bright up extra */
      30%  { filter: brightness(0); } /* dark */
      45%  { filter: brightness(2); } /* bright */
      60% { filter: brightness(0.5); }   /* darkish */
      75%  { filter: brightness(1.5); } /* bright-ish */
      90% { filter: brightness(1); }   /* standard */
      100% { filter: brightness(1); }   /* standard */
    }
    .flash-briefly {
        animation: briefLightening 1s forwards; /* Adjust 1s to change the total duration */
    }
    """
    script = f"""
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `{css}`;
    document.head.appendChild(style);
    """
    # add this animation style to website, that allows briefly highlighting element
    self.execute_script(script)
    return val
  
  def find_element(self, by=By.ID, value: str | None = None) -> WebElement:
    element = super().find_element(by, value)
    if self.should_highlight_element:
      self.highlight_element(element)
    return element
  
  def highlight_element(self, element):
    self.execute_script("arguments[0].classList.add('flash-briefly');", element)


class Wait4ElementDriver(HighlightElementDriver):
  ''' browser that waits up to 1 second (configurable)
      waiting for element to show up before failing to find it
  '''
  wait_time = 1
  pause_time = 0

  def find_element(self, by, selector):
    start_time = time.time()
    element = None
    while time.time() - start_time < self.wait_time:
      try:
        element = super().find_element(by, selector)
        assert element.is_displayed() and element.is_enabled()
        break  # element is ready!
      except:
        continue  # keep trying until timeout
    if element is None:  # element was never found, throw error by retrying one last time
        element = super().find_element(by, selector)
    time.sleep(self.pause_time)  # pause (if desired) before interacting w/ or clicking element
    return element


class RefetchStaleElement(WebElement):
  ''' this class should override any method that has triggered a StaleElementException
      or any other exception that could've been solved by retry-fetching the element first
      before performing the action.
  '''
  _find_by_args = None

  def click(self):
    time_begin = time.time()
    val = None
    element = super()
    # self._parent is the webdriver
    while time.time() - time_begin < self._parent.wait_time:
      try:
        val = element.click()
        break
      except StaleElementReferenceException:
        # element failed because it became outdated before it got clicked. Generally, refetching
        # the element and re-clicking is the best course of action. So let's do that!
        # revert elements to base element (so we don't trigger THIS function from THAT element)
        # and ask webdriver parent to find element. Then try clicking it again!
        self._parent._web_element_cls = WebElement  # any found element will be base WebElement instance
        element = self._parent.find_element(*self._find_by_args)
        continue
    self._parent._web_element_cls = RefetchStaleElement  # restore element found to be this instance again
    return val


class RefetchStaleDriver(Wait4ElementDriver):
  ''' uses RefetchStaleElement to provide refetching of Element, if when clicking, it is stale '''

  _web_element_cls = RefetchStaleElement # override element to be our wrapper that can retry fetching itself!

  def find_element(self, *args):
    element = super().find_element(*args)
    element._find_by_args = args  # for refetching element, should it become stale
    return element


class BrowserSetup():
  ''' inherit from this base in your selenium tests. Will set up browser with working config
      just make sure to DELETE setup_method() in your test class!!
  '''

  @property
  def _ubuntu_version(self):
    try:
        with open('/etc/os-release', 'r') as os_release_file:
            for line in os_release_file:
                if line.startswith('PRETTY_NAME='):
                    return line.split('=')[1].strip().strip('"')
    except Exception:
        pass
    return ''

  def setup_method(self, method):
    options = Options()
    # supply --headless=false when running pytest in order to see browser
    options.headless = not '--headless=false' in sys.argv
    service = Service()
    if self._ubuntu_version.startswith('Ubuntu 22.04'):
      # workaround for default install of firefox on ubuntu 22.04
      try:
          result = subprocess.check_output(["which", "geckodriver"], stderr=subprocess.STDOUT, text=True)
          geckodriver_path = result.strip()
          service = Service(executable_path=geckodriver_path)
      except subprocess.CalledProcessError as e:
          pass

    self.driver = RefetchStaleDriver(options=options, service=service)  # it's Firefox improved
    # options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Enable headless mode
    # self.driver = webdriver.Chrome(options=options)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
