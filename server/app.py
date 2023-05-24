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
  print(notes)
  return notes

@app.route('/notes/<id>', methods=['GET', 'PUT'])
def note(id):
  if request.method == 'PUT':
    return create_or_modify_note(request)
  with open(filename, 'r') as f:
    db = json.load(f)
    notes = db['notes']

    for note in notes:
      if note['id'] == id:
        return note

  return {}

@app.route('/notes/<id>', methods=['DELETE'])
def note_delete(id):
  id_list = id.split(',')
  # whether a list of id's or a single id, make sure id_list is a list of ID's
  print(id_list)
  with open(filename, 'r') as f:
    db = json.load(f)
    notes = db['notes']

  # find notes that are in our id_list, and create a temporary index for notes to delete
  to_delete = []
  for i, note in enumerate(notes):
    if note['id'] in id_list:
      to_delete.append(i)
  if not to_delete:
     return 'None deleted'
  
  # delete notes in reverse order of index, to prevent index shifts from causing undesired behavior
  for i in reversed(to_delete):
    del notes[i]
  # write changes back (outside of for-loop) to file
  with open(filename, 'w') as f:
    json.dump(db, f)

  return 'Delete success'

app.run(debug=True)