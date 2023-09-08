from flask import Flask, request, session
import uuid
import sqlite3
from constants import DB_FILE, DEFAULT_FOLDER_ID
from app_setup import app


def create_or_modify_note(request, is_new_note=False):
    # read in existing notes
    user_id = session.get('user_id')
    note = request.json
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
    if not is_new_note:
        # support creating note from the UPDATE_NOTE backend, to simplify front end process
        cursor.execute('SELECT 1 FROM NOTES WHERE folder_id=? and user_id=? and id=?', (folder, user_id, id))
        note_exists = cursor.fetchone()
        print('note', note_exists)
        if not note_exists or not note_exists[0]:  # looking for  either (,) or (None,)
            is_new_note = True
    if is_new_note:
        cursor.execute('INSERT INTO NOTES (id, title, body, user_id, folder_id) VALUES (?, ?, ?, ?, ?)', (id, title, body, user_id, folder))
    if not is_new_note:
        cursor.execute('UPDATE NOTES SET title=?, body=?, folder_id=? where user_id=? and id=?', (title, body, folder, user_id, id))
    connection.commit()
    connection.close()

    return note  # returning full note so it doesn't have to get re-fetched


@app.route('/notes', methods=['GET', 'POST'])
def notes():
    if request.method == 'POST':
        # rather than fetching notes, we are creating a new one
        return create_or_modify_note(request, is_new_note=True)  # force a new note; allows front-end to specify ID of note

    user_id = session.get('user_id')
    folder_id = request.args.get('folder')  # url just needs a ?folder=<id> appended
    # special 'All Notes' folder shows all notes
    if folder_id == str(DEFAULT_FOLDER_ID):  # have to compare strings, since folder_id is a str
        folder_id = None

    # if we get here, we are fetching all notes
    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row  # results come back as dictionaries
    cursor = connection.cursor()
    if folder_id:
        cursor.execute('SELECT * FROM NOTES WHERE user_id=? and folder_id=? ORDER BY last_modified DESC', (user_id, folder_id,))
    else:
        cursor.execute('SELECT * FROM NOTES WHERE user_id=? ORDER BY last_modified DESC', (user_id,))
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
    cursor.execute('SELECT * FROM NOTES WHERE id=?', (id,))
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
        cursor.execute('DELETE FROM NOTES WHERE id=?', (tuple_ids[0],))
    else:
        question_marks = ', '.join('?' for _ in tuple_ids)  # aka '?, ?, ?' if 3 id's passed
        cursor.execute(f'DELETE FROM NOTES WHERE id IN ({question_marks})', tuple_ids)

    connection.commit()
    connection.close()

    return 'Delete success'
