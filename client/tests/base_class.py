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

  def find_element(self, by, selector):
    time.sleep(self.pause_between_time/2)
    start_time = time.time()
    while time.time() - start_time < self.retry_time:
      try:
        element = super().find_element(by, selector)
        assert element.is_displayed() and element.is_enabled()
      except:
        continue  # keep trying until timeout
    if self.should_highlight_element:
      self.highlight_element(element)
    time.sleep(self.pause_between_time/2)
    return element

  def highlight_element(self, element, duration=1):
    ''' this currently doesn't work, but doesn't break website, either'''
    def apply_style(s):
      self.driver.execute_script("arguments[0].setAttribute('style', arguments[1]);", element, s)
    
    original_style = element.get_attribute('style')
    apply_style("border: 2px solid red;")
    
    # now unhighlight-element after set duration
    async def unhighlight_element():
      asyncio.sleep(duration)
      try:
        apply_style(original_style)
      except:
        pass
    task = asyncio.create_task(unhighlight_element())  # requires python 3.7+
    self._element_highlight_tasks.add(task)
      


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
