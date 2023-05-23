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


@app.route('/')
def home():
	return 'Flask app is running!!!'

def create_or_modify_note(request):
    # read in existing notes
    try:
        with open(filename, 'r') as f:
            db = json.load(f)
    except Exception as err:  # catch general exception with either file or json
        print(err)
        db = {'notes': []}
        
    # verify new note has an ID
    note = request.json
    # preferentially use the ID passed in at top of function
    id = note['id'] # ID from post request, if updating note
    if id is None or id == '':
        id = uuid.uuid4().hex # a 32-character lowercase hexadecimal string
        note['id'] = id
        is_new_note = True
    else:
        is_new_note = False

    # add note to our notes json, and write back to file
    if is_new_note:
        db['notes'].append(note)
    else:
        # find current note in notes, and update title and body
        for i, db_note in enumerate(db['notes']):
            if id == db_note['id']:
                # this is the note we want to update/replace
                db['notes'][i] = note
                break
    with open(filename, 'w') as f:
        json.dump(db, f)

    return id

@app.route('/notes', methods=['GET', 'POST'])
def notes():
  if request.method == 'POST':
    # rather than fetching notes, we are creating a new one
    return create_or_modify_note(request)

  # if we get here, we are fetching all notes
  with open(filename, 'r') as f:
    try:
      db = json.load(f)
    except json.decoder.JSONDecodeError:
      return []
  return db['notes'] if 'notes' in db else db

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