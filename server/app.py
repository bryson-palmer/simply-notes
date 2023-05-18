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

app.run()