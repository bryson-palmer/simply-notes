import time
import sys
import subprocess
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
    self.retry_time = kwargs.pop('retry_for', 1)
    super().__init__(*args, **kwargs)

  def find_element(self, by, selector):
    start_time = time.time()
    while time.time() - start_time < self.retry_time:
      try:
        element = super().find_element(by, selector)
        assert element.is_displayed() and element.is_enabled()
      except:
        continue  # keep trying until timeout
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

    self.driver = PauseFox(options=options, service=service)
    # options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Enable headless mode
    # self.driver = webdriver.Chrome(options=options)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
