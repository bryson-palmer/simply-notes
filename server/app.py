import db_setup
import folders
import notes  # this auto-decoreates note-related functions with app.route(...)
from app_setup import app, app_configure
from users import create_new_user_if_uninitialized
from flask import request, Response, jsonify

app_configure()  # set up secret keys, cookie settings, CORS, etc.

db_setup.create_update_tables()

@app.route('/')
def frontend_bootstrap():
	''' when navigating to root, direct user to bootstrap rest of page from front-end server.
		This html here is exactly the first thing seen when loading from frontend root.
		So it's a hard-coded version of what the react front-end first serves up.
		If this ever changes, (can check by visiting front-end), then you'll need to update
		the html here too.
		Note that to get this to work, we had to build front-end to reference all assets with
		an absolute URL.
		The reason for doing this is that Safari (and likely soon other browsers too) don't
		allow third-party cookies (cookies being sent to another domain than the base domain).
		And since our authentication is through the cookie, we have to load the website from
		our backend, so that cookies will be sent to our backend. This is a convenient way to
		load the frontend from our backend. With one downside being that if we used URLs in
		the app, we'd have to make sure they didn't clash with our backend API urls.
	'''
	react_html_root = '''
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="apple-touch-icon" sizes="180x180" href="https://simply-notes-gamma.vercel.app/apple-touch-icon.png">
			<link rel="icon" type="image/png" sizes="32x32" href="https://simply-notes-gamma.vercel.app/favicon-32x32.png">
			<link rel="icon" type="image/png" sizes="16x16" href="https://simply-notes-gamma.vercel.app/favicon-16x16.png">
			<link rel="manifest" href="https://simply-notes-gamma.vercel.app/site.webmanifest">
			<title>Simply-Notes</title>
			<script type="module" crossorigin src="https://simply-notes-gamma.vercel.app/assets/index.js"></script>
			<link rel="stylesheet" href="https://simply-notes-gamma.vercel.app/assets/index.css">
		</head>
		<body>
			<div id="root"></div>
			
		</body>
		</html>
	'''
	return react_html_root

if __name__ == '__main__':
	app.run(debug=True)