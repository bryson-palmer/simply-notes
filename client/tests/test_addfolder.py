# Generated by Selenium IDE
import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

class TestAddfolder():
  def setup_method(self, method):
    self.driver = webdriver.Firefox()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_addfolder(self):
    # Test name: add_folder
    # Step # | name | target | value
    # 1 | open | / | 
    self.driver.get("http://localhost:5173/")
    # 2 | setWindowSize | 743x851 | 
    # make window small enough that drawer toggle is visible
    self.driver.set_window_size(743, 851)
    # 3 | click | id=toggleDrawer | 
    # slide out drawer
    self.driver.find_element(By.ID, "toggleDrawer").click()
    # 4 | click | css=#newFolderButton > path | 
    # click button to create new folder
    self.driver.find_element(By.CSS_SELECTOR, "#newFolderButton > path").click()
    # 5 | type | id=folderName | new folder
    # new folder auto-focuses. Type in 'new folder'
    self.driver.find_element(By.ID, "folderName").send_keys("new folder")
    # 6 | submit | id=folderName | 
    # firefox doesn't work if you send_keys(KEY_ENTER), so we submit() form instead
    raise Exception("'submit' is not a supported command in Selenium WebDriver. Please re-record the step in the IDE.")
    # 7 | click | xpath=//span[contains(.,'new folder')] | 
    # click newly created folder to verify it exists
    self.driver.find_element(By.XPATH, "//span[contains(.,\'new folder\')]").click()
    # 8 | mouseOver | id=optionsFolder | 
    element = self.driver.find_element(By.ID, "optionsFolder")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    # 9 | click | id=optionsFolder | 
    # open options on folder
    self.driver.find_element(By.ID, "optionsFolder").click()
    # 10 | mouseOut | id=optionsFolder | 
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element(element, 0, 0).perform()
    # 11 | click | id=deleteFolderButton | 
    # delete folder. Cleanup is nice so test is repeatable
    self.driver.find_element(By.ID, "deleteFolderButton").click()
  
