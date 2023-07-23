import db_setup
import folders
import notes  # this auto-decoreates note-related functions with app.route(...)
from app_setup import app, app_configure
from users import create_new_user_if_uninitialized

if __name__ == '__main__':
	app_configure()  # set up secret keys, cookie settings, CORS, etc.
else:
	app_configure(origins=['simple-notes-gamma.vercel.app'])

db_setup.create_update_tables()

@app.route('/')
def home():
	return 'Flask app is running!!!'

if __name__ == '__main__':
	app.run(debug=False)