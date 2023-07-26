import os

from datetime import timedelta
from flask import Flask 
from flask_cors import CORS


app = Flask(__name__)

def app_configure():
    CORS(app, supports_credentials=True)
    app.permanent_session_lifetime = timedelta(days=31)  # how long before they must log in again
    # Work around for cookies not saving in Chrome
    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    # with None, cookies are less secure, can be sent as 3rd party cookies. Safari doesn't allow them.
    # Workaround for safari is to actually bootstrap the front-end from the backend root
    app.config["SESSION_COOKIE_SECURE"] = "True"

    # load secret key from .env file (or create it and then load it)
    SECRET_FILE = '.env.local'
    if not os.path.exists(SECRET_FILE):
        with open(SECRET_FILE, 'w') as f:
            f.write(f'{os.urandom(24)}')
    with open(SECRET_FILE, 'r') as f:
        app.secret_key = f.readline()
