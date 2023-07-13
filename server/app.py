import db_setup
import folders
import notes  # this auto-decoreates note-related functions with app.route(...)
from flask_setup import app, app_configure
from users import create_new_user_if_uninitialized

app_configure()  # set up secret keys, cookie settings, CORS, etc.

db_setup.create_update_tables()

@app.route('/')
def home():
	return 'Flask app is running!!!'

if __name__ == '__main__':
	app.run(debug=False)