import db_setup
import folders
import notes  # this auto-decoreates note-related functions with app.route(...)
from app_setup import app, app_configure
from users import create_new_user_if_uninitialized
from flask import request, Response, jsonify

if __name__ == '__main__':
	app_configure()  # set up secret keys, cookie settings, CORS, etc.
else:
	app_configure() #origins=['simple-notes-gamma.vercel.app'])

db_setup.create_update_tables()

@app.route('/')
def home():  # when
	''' when navigating here, redirect user to load resources from front-end server.
		This response is exactly the first thing loaded when querying the frontend root.
	'''
	react_html_root = '''
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="apple-touch-icon" sizes="180x180" href="https://simple-notes-gamma.vercel.app/apple-touch-icon.png">
			<link rel="icon" type="image/png" sizes="32x32" href="https://simple-notes-gamma.vercel.app/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="16x16" href="https://simple-notes-gamma.vercel.app/favicon-16x16.png">
			<link rel="manifest" href="https://simple-notes-gamma.vercel.app/site.webmanifest">
			<title>ToDo</title>
			<script type="module" crossorigin src="https://simple-notes-gamma.vercel.app/assets/index.js"></script>
			<link rel="stylesheet" href="https://simple-notes-gamma.vercel.app/assets/index.css">
		</head>
		<body>
			<div id="root"></div>
			
		</body>
		</html>
	'''
	return react_html_root

if __name__ == '__main__':
	app.run(debug=True)