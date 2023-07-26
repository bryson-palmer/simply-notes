import os
import sqlite3

DIRNAME = os.path.dirname(__file__)  # removes filename from path to just get directory
FILENAME = os.path.join(DIRNAME, '../client/mockData/db.json')
DB_FILE = os.path.join('/data', 'app.db')

# we need to verify DB_FILE works as expected, or default back to original implementation
try:
    connection = sqlite3.connect(DB_FILE)
    connection.close()
except sqlite3.OperationalError:
    print('no /data volume! DB_FILE fallback')
    DB_FILE = os.path.join(DIRNAME, 'app.db')
