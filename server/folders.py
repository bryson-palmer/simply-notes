import sqlite3
import uuid
from flask import request, session

from app_setup import app
from constants import DB_FILE
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
        cursor.execute('SELECT * FROM FOLDERS WHERE user_id="%s"' % user_id)
        results = cursor.fetchall()

        folders=[]
        for result in results:
            (id, folderName) = result[:2]  # next two entries are user_id, last_modified, in that order
            folder = dict(id=id, folderName=folderName)
            folders.append(folder)
        if not folders:
            # special workaround for first-time users;
            # give them a temporary default folder without creating a table entry
            folders = [dict(id='undefined', folderName='Default Folder')]
        
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
            cursor.execute(f'INSERT INTO FOLDERS (id, folderName, user_id) VALUES ("{id}", "{folder_name}", "{user_id}")')
        if not is_new_folder:
            cursor.execute('UPDATE FOLDERS SET folderName="%s" where id="%s" and user_id="%s"' % (folder_name, id, user_id))
        connection.commit()
        
        # as a quirk where a new user does not initially get a folder for just visiting the site
        # we force all unassociated notes to be associated with the first folder
        if is_new_folder:
            # if this was the first folder was saved, update all notes to use this folder
            folders_count = cursor.execute('SELECT 0 FROM FOLDERS WHERE id="%s" and user_id="%s"' % (id, user_id))
            if folders_count == 1:
                cursor.execute('''
                               UPDATE NOTES
                               SET folder_id="%s"
                               WHERE user_id="%s"
                               ''' % (id, user_id))


        connection.close()

        return id

@app.route('/folders/<id>', methods=['DELETE'])
def folder_delete(id):
    tuple_ids = tuple(id.split(','))

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    if len(tuple_ids) == 1:
        cursor.execute(f'DELETE FROM FOLDERS WHERE id = "{tuple_ids[0]}"')
    else:
        cursor.execute(f'DELETE FROM FOLDERS WHERE id IN {tuple_ids}')
    
    connection.commit()
    connection.close()

    return 'Delete success'