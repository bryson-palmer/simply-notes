from flask import Flask, request, session
import uuid
import sqlite3
from constants import DB_FILE
from app_setup import app


def create_or_modify_note(request):
    # read in existing notes
    user_id = session.get('user_id')
    note = request.json
    is_new_note = False
    id = note.get('id') # ID from post request, if updating note
    if id is None or id == '':
        id = uuid.uuid4().hex # a 32-character lowercase hexadecimal string
        note['id'] = id
        is_new_note = True
    
    title = note['title']
    body = note['body']
    folder = note.get('folder')
    
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    if is_new_note:
        cursor.execute(f'INSERT INTO NOTES (id, title, body, user_id, folder_id) VALUES ("{id}", "{title}", "{body}", "{user_id}", "{folder}")')
    if not is_new_note:
        cursor.execute('UPDATE NOTES SET title="%s", body="%s", folder_id="%s" where user_id="%s" and id="%s"' % (title, body, folder, user_id, id))
    connection.commit()
    connection.close()

    return note  # returning full note so it doesn't have to get re-fetched


@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        # rather than fetching notes, we are creating a new one
        return create_or_modify_note(request)

    user_id = session.get('user_id')
    print(f'Notes: user_id: {user_id}')
    folder_id = request.args.get('folder')  # url just needs a ?folder=<id> appended
    print('folder_id', folder_id)
    # if we get here, we are fetching all notes
    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row  # results come back as dictionaries
    cursor = connection.cursor()
    if folder_id:
        cursor.execute('SELECT * FROM NOTES WHERE user_id="%s" and folder_id="%s"' % (user_id, folder_id,))
    else:
        cursor.execute('SELECT * FROM NOTES WHERE user_id="%s"' % (user_id,))
    results = cursor.fetchall()  # [['uadfsdf', 'title', 'body', None], []...]
    notes = []
    for result in results:
        note = dict(result)
        note['folder'] = note['folder_id']  # front end expects 'folder' instead of 'folder_id'
        del note['folder_id']  # unneccesary cleanup of variables
        notes.append(note)

    connection.close()
    return notes


@app.route('/notes/<id>', methods=['GET', 'PUT'])
def note(id):
    if request.method == 'PUT':
        return create_or_modify_note(request)
    
    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()
    cursor.execute(f'SELECT * FROM NOTES WHERE id = "{id}"')
    note = cursor.fetchone()
    if note is None:
        return {}  # if ID was invalid
    note_dict = dict(id=note[0], title=note[1], body=note[2], folder=note[4])

    connection.close()
    return note_dict


@app.route('/notes/<id>', methods=['DELETE'])
def note_delete(id):
    tuple_ids = tuple(id.split(','))

    connection = sqlite3.connect(DB_FILE)
    cursor = connection.cursor()

    if len(tuple_ids) == 1:
        cursor.execute(f'DELETE FROM NOTES WHERE id = "{tuple_ids[0]}"')
    else:
        cursor.execute(f'DELETE FROM NOTES WHERE id IN {tuple_ids}')

    connection.commit()
    connection.close()

    return 'Delete success'
