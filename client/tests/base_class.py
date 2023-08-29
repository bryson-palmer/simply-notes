from selenium import webdriver
from selenium.webdriver.firefox.options import Options

class BrowserSetup():
  ''' inherit from this base in your selenium tests. Will set up browser with working config
      just make sure to DELETE setup_method() in your test class!!
  '''
  def setup_method(self, method):
    options = Options()
    options.headless = True
    self.driver = webdriver.Firefox(options=options)
    # options = webdriver.ChromeOptions()
    # options.add_argument("--headless")  # Enable headless mode
    # self.driver = webdriver.Chrome(options=options)
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
