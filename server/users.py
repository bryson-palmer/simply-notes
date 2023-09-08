import sqlite3
import uuid

from constants import DB_FILE


def get_new_user_id():
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    already_exists = True
    while already_exists:
        id = uuid.uuid4().hex
        cursor.execute('SELECT * FROM USERS WHERE id=?', (id,))
        already_exists = cursor.fetchone()
    # only fill in ID
    cursor.execute('INSERT INTO USERS (id) VALUES (?)', (id,))
    connection.commit()
    connection.close()
    return id


def create_new_user_if_uninitialized(session):
    if session.get('user_id'):
        return
    user_id = get_new_user_id()
    session['user_id'] = user_id
    session.permanent = True
    session.modified = True
    # also handle copying demo data from demo user to this new user's data