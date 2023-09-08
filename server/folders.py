import sqlite3
import uuid
from flask import request, session

from app_setup import app
from constants import DB_FILE, DEFAULT_FOLDER_ID, DEFAULT_FOLDER_NAME
from users import create_new_user_if_uninitialized


@app.route('/folders', methods=['GET', 'POST'])
def folders():
    # this is the first thing the app loads on startup. If this is a user who hasn't logged in yet,
    # give them demo data (but how?)
    create_new_user_if_uninitialized(session)
    user_id = session.get('user_id')

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    if request.method == 'GET':
        cursor.execute('SELECT * FROM FOLDERS WHERE user_id=?', (user_id,))
        results = cursor.fetchall()

        folders=[]
        for result in results:
            (id, folderName) = result[:2]  # next two entries are user_id, last_modified, in that order
            folder = dict(id=id, folderName=folderName)
            folders.append(folder)
        if not folders:
            folders = [create_default_all_notes_folder()]
        
        connection.close()
        return folders
    
    if request.method == 'POST':
        folder = request.json
        is_new_folder = False
        folder_name = folder['folderName']
        id = folder.get('id')

        if id is None or id == '':
            id = uuid.uuid4().hex # a 32-character lowercase hexadecimal string
            folder['id'] = id
            is_new_folder = True

        if is_new_folder:
            cursor.execute('INSERT INTO FOLDERS (id, folderName, user_id) VALUES (?, ?, ?)', (id, folder_name, user_id))
        if not is_new_folder:
            cursor.execute('UPDATE FOLDERS SET folderName=? where id=? and user_id=?', (folder_name, id, user_id))
        connection.commit()
        
        connection.close()

        return id


def create_default_all_notes_folder():
    ''' a folder with null ID. But we create it so the user can rename it.
        Will be regenerated if user deletes all folders. This folder is
        special because of the null ID -- allows user to see ALL notes
    '''
    id = DEFAULT_FOLDER_ID
    user_id = session.get('user_id')
    folder_name = DEFAULT_FOLDER_NAME
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    cursor.execute(f'INSERT INTO FOLDERS (id, folderName, user_id) VALUES (?, ?, ?)', (id, folder_name, user_id))
    connection.commit()
    connection.close()
    return dict(id=DEFAULT_FOLDER_ID, name=DEFAULT_FOLDER_NAME)


@app.route('/folders/<id>', methods=['DELETE'])
def folder_delete(id):
    tuple_ids = tuple(id.split(','))

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    if len(tuple_ids) == 1:
        cursor.execute('DELETE FROM FOLDERS WHERE id = ?', (tuple_ids[0],))
    else:
        question_marks = ', '.join('?' for _ in tuple_ids)  # aka '?, ?, ?' if 3 id's passed
        cursor.execute(f'DELETE FROM FOLDERS WHERE id IN ({question_marks})', tuple_ids)
    
    connection.commit()
    connection.close()

    return 'Delete success'