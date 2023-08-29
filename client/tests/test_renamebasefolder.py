# Generated by Selenium IDE
import pytest
import time
import json
import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from selenium.webdriver.firefox.options import Options

class TestRenamebasefolder():
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
  
  def test_renamebasefolder(self):
    # Test name: rename base folder
    # Step # | name | target | value
    # 1 | open | / | 
    self.driver.get("http://localhost:5173/")
    # 2 | setWindowSize | 550x691 | 
    self.driver.set_window_size(550, 691)
    # 3 | click | css=.css-twf33t-MuiButtonBase-root-MuiButton-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".css-twf33t-MuiButtonBase-root-MuiButton-root").click()
    # 4 | click | css=.MuiBackdrop-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiBackdrop-root").click()
    # 5 | click | css=.css-twf33t-MuiButtonBase-root-MuiButton-root .MuiSvgIcon-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".css-twf33t-MuiButtonBase-root-MuiButton-root .MuiSvgIcon-root").click()
    # 6 | click | css=.MuiListItemSecondaryAction-root:nth-child(2) | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemSecondaryAction-root:nth-child(2)").click()
    # 7 | click | css=.MuiListItemSecondaryAction-root:nth-child(2) | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemSecondaryAction-root:nth-child(2)").click()
    # 8 | mouseDownAt | css=.MuiListItemButton-root | 36,17.5
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).click_and_hold().perform()
    # 9 | mouseMoveAt | css=.MuiListItemButton-root | 36,17.5
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    # 10 | mouseUpAt | css=.MuiListItemButton-root | 36,17.5
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).release().perform()
    # 11 | click | css=.MuiListItemButton-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root").click()
    # 12 | click | css=.MuiListItemButton-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root").click()
    # 13 | doubleClick | css=.MuiListItemButton-root | 
    element = self.driver.find_element(By.CSS_SELECTOR, ".MuiListItemButton-root")
    actions = ActionChains(self.driver)
    actions.double_click(element).perform()
    # 14 | type | id=folderName | Fival
    self.driver.find_element(By.ID, "folderName").send_keys("Fival")
    # 15 | sendKeys | id=folderName | ${KEY_ENTER}
    self.driver.find_element(By.ID, "folderName").send_keys(Keys.ENTER)
    # 16 | click | css=.MuiBackdrop-root | 
    self.driver.find_element(By.CSS_SELECTOR, ".MuiBackdrop-root").click()
  
