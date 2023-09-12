import time
import sys
import os
import subprocess
import asyncio
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait

class PauseFox(webdriver.Firefox):
  ''' browser that pauses up to 1 second (configurable)
      waiting for element to show up before failing to find it
  '''
  def __init__(self, *args, **kwargs):
    self.retry_time = kwargs.pop('retry_for', None)
    # defines retry-time for each command (before a failure to find an element throws an exception)
    if self.retry_time is None:
      self.retry_time = os.environ.get('RETRY_FOR', 1)
    # defines pause-time between each command
    self.pause_between_time = os.environ.get('PAUSE_FOR', 1)
    self.click_pause_time = os.environ.get('CLICK_PAUSE', 0)  # pause after clicking anything
    self.should_highlight_element = os.environ.get('HIGHLIGHT', 0)
    self._element_highlight_tasks = set()  # for preventing un-highlight task from being garbage-collected
    super().__init__(*args, **kwargs)
  
  def get(self, *args, **kwargs):
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

  def find_element(self, by, selector):
    time.sleep(self.pause_between_time/2)
    start_time = time.time()
    while time.time() - start_time < self.retry_time:
      try:
        element = super().find_element(by, selector)
        assert element.is_displayed() and element.is_enabled()
        break  # element is ready!
      except:
        continue  # keep trying until timeout
    if self.should_highlight_element:
      self.highlight_element(element)
    time.sleep(self.pause_between_time/2)
    return element

  def highlight_element(self, element):
    self.execute_script("arguments[0].classList.add('flash-briefly');", element)


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

    self.driver = PauseFox(options=options, service=service)
    # options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Enable headless mode
    # self.driver = webdriver.Chrome(options=options)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
