import pytest

# when running tests locally, I'd like to run 'yarn test' and see actual firefox pop up
# this is a workaround for that: we add the pytest config option, but don't use it.
# this is only so an error isn't thrown when we pass --headless=false
# the actual config check is done through sys.argv because pytest doesn't allow accessing config options
# from within the setup() method, where we set up the browser
def pytest_addoption(parser):
    parser.addoption(
        "--headless", action="store", default="true", help="Run tests in headless mode: true or false"
    )