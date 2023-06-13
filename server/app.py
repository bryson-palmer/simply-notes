import sqlite3
import uuid
from flask import Flask, request
import json
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

dirname = os.path.dirname(__file__)  # removes filename from path to just get directory
filename = os.path.join(dirname, '../client/mockData/db.json')

db_file = os.path.join(dirname, 'app.db')
connection = sqlite3.connect(db_file)

cursor = connection.cursor()
create_notes_table = """
  CREATE TABLE IF NOT EXISTS NOTES(id, title, body, user_id)
"""
create_folders_table = """
  CREATE TABLE IF NOT EXISTS FOLDERS(id, folderName)
"""
cursor.execute(create_notes_table)
cursor.execute(create_folders_table)
connection.commit()

@app.route('/')
def home():
	return 'Flask app is running!!!'

def create_or_modify_note(request):
    # read in existing notes
    note = request.json
    is_new_note = False
    id = note.get('id') # ID from post request, if updating note
    if id is None or id == '':
        id = uuid.uuid4().hex # a 32-character lowercase hexadecimal string
        note['id'] = id
        is_new_note = True
    
    title = note['title']
    body = note['body']
        
    connection = sqlite3.connect('app.db')
    cursor = connection.cursor()
    if is_new_note:
        cursor.execute(f'INSERT INTO NOTES (id, title, body, user_id) VALUES ("{id}", "{title}", "{body}", null)')
    if not is_new_note:
        cursor.execute('UPDATE NOTES SET title="%s", body="%s" where id="%s"' % (title, body, id))
    connection.commit()

    return id

@app.route('/notes', methods=['GET', 'POST'])
def notes():
  if request.method == 'POST':
    # rather than fetching notes, we are creating a new one
    return create_or_modify_note(request)

  # if we get here, we are fetching all notes
  connection = sqlite3.connect('app.db')
  cursor = connection.cursor()
  cursor.execute('SELECT * FROM NOTES')
  results = cursor.fetchall()  # [['uadfsdf', 'title', 'body', None], []...]
  notes = []
  for result in results:
    (id, title, body, user_id) = result
    note = dict(id=id, title=title, body=body, user_id=user_id)
    notes.append(note)

  return notes

@app.route('/notes/<id>', methods=['GET', 'PUT'])
def note(id):
  if request.method == 'PUT':
    return create_or_modify_note(request)
  
  connection = sqlite3.connect('app.db')
  cursor = connection.cursor()
  cursor.execute(f'SELECT * FROM NOTES WHERE id = "{id}"')
  note = cursor.fetchone()
  note_dict = dict(id=note[0], title=note[1], body=note[2])

  return note_dict

@app.route('/notes/<id>', methods=['DELETE'])
def note_delete(id):
  tuple_ids = tuple(id.split(','))

  connection = sqlite3.connect('app.db')
  cursor = connection.cursor()

  if len(tuple_ids) == 1:
    cursor.execute(f'DELETE FROM NOTES WHERE id = "{tuple_ids[0]}"')
  else:
    cursor.execute(f'DELETE FROM NOTES WHERE id IN {tuple_ids}')
  
  connection.commit()

  return 'Delete success'

@app.route('/folders', methods=['GET', 'POST'])
def folders():
    connection = sqlite3.connect('app.db')
    cursor = connection.cursor()
    if request.method == 'GET':
        cursor.execute('SELECT * FROM FOLDERS')
        results = cursor.fetchall()

        folders=[]
        for result in results:
          (id, folderName) = result
          folder = dict(id=id, folderName=folderName)
          folders.append(folder)
        
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
            cursor.execute(f'INSERT INTO FOLDERS (id, folderName) VALUES ("{id}", "{folder_name}")')
        if not is_new_folder:
            cursor.execute('UPDATE FOLDERS SET folderName="%s" where id="%s"' % (folder_name, id))
        connection.commit()

        return id

@app.route('/folders/<id>', methods=['DELETE'])
def folder_delete(id):
  tuple_ids = tuple(id.split(','))

  connection = sqlite3.connect('app.db')
  cursor = connection.cursor()

  if len(tuple_ids) == 1:
    cursor.execute(f'DELETE FROM FOLDERS WHERE id = "{tuple_ids[0]}"')
  else:
    cursor.execute(f'DELETE FROM FOLDERS WHERE id IN {tuple_ids}')
  
  connection.commit()

  return 'Delete success'

app.run(debug=True)