import time
from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.ui import WebDriverWait

class PauseFox(webdriver.Firefox):
  ''' browser that pauses up to 1 second (configurable)
      waiting for element to show up before failing to find it
  '''
  def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.retry_time = kwargs.pop('retry_for', 1)

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
  def setup_method(self, method):
    options = Options()
    options.headless = True
    self.driver = PauseFox(options=options)
    # options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Enable headless mode
    # self.driver = webdriver.Chrome(options=options)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
