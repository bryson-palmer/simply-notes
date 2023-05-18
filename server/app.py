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
		try:
			db = json.load(f)
			print(f'db: => {db}')
		except json.decoder.JSONDecodeError:
			return []
	return db['notes'] if 'notes' in db else db

@app.route('/notes/<id>')
def note(id):
	print('get note by id')
	with open(filename, 'r') as f:
		db = json.load(f)
		notes = db['notes']

		for note in notes:
			if note['id'] == int(id):
				return note

	return {}

@app.route('/notes/<id>', methods=['Delete'])
def note_delete(id):
	print('In note_delete')
	with open(filename, 'r') as f:
		db = json.load(f)
		notes = db['notes']
		print(f'In with statement & db created: notes: {notes}')

	for i, note in enumerate(notes):
		if note['id'] == int(id):
			print('In if statement: id == id')
			del notes[i]
			with open(filename, 'w') as f:
				json.dump(db, f)

			return 'Delete success'

	return 'Delete success'

app.run()