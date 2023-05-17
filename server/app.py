import sqlite3
from flask import Flask
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

@app.route('/notes')
def notes():
  with open(filename, 'r') as f:
    db = json.load(f)

  return db['notes']

@app.route('/notes/<id>')
def note(id):
  # print(f'id: {id}')
  with open(filename, 'r') as f:
    db = json.load(f)
    notes = db['notes']
    # print(f'notes: {notes}')

    for note in notes:
      if note['id'] == int(id):
        # print(f'note["id"]: {note["id"]}')
        # print(f'note: {note}')
        return note

  return {}

app.run()