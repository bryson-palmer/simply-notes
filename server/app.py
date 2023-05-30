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
cursor.execute(create_notes_table)
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
  # whether a list of id's or a single id, make sure tuple_ids is a list of ID's
  print(f'tuple_ids: {tuple_ids}')

  connection = sqlite3.connect('app.db')
  cursor = connection.cursor()

  if len(tuple_ids) == 1:
    cursor.execute(f'DELETE FROM NOTES WHERE id = "{tuple_ids[0]}"')
  else:
    cursor.execute(f'DELETE FROM NOTES WHERE id IN {tuple_ids}')
  
  connection.commit()

  return 'Delete success'

@app.route('/folders')
def folders():
   return [{'id': 0, 'title': 'unknown'}, {'id': 1, 'title': 'personal'}]

app.run(debug=True)