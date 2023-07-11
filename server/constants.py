import os

DIRNAME = os.path.dirname(__file__)  # removes filename from path to just get directory
FILENAME = os.path.join(DIRNAME, '../client/mockData/db.json')
DB_FILE = os.path.join(DIRNAME, 'app.db')
