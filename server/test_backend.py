# test_app.py

import pytest
from bs4 import BeautifulSoup
from app import app
import notes as Notes

USER = 'USER_ID'

@pytest.fixture
def client():
    # flask built-in that allows you to query the backend with this test-client
    app.testing = True
    with app.test_client() as client:
        yield client

def delete_all_notes():
    notes = Notes.get_notes('', USER)
    print(notes)
    note_ids = [note['id'] for note in notes]
    Notes.delete_notes(note_ids, USER)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    ''' pytest fixture abuse that's well accepted. Used to perform setup & teardown for each test '''
    # do set up stuff here
    delete_all_notes()
    yield
    # do teardown stuff here


def test_home_endpoint_looks_like_html(client):
    ''' home endpoint returns html that loads the front-end code '''
    response = client.get('/')
    assert response.status_code == 200
    html_text = response.data.decode('utf-8')
    soup = BeautifulSoup(html_text, 'html.parser')
    assert soup.find('html') or soup.find('body')
    #assert response.get_json() == {"message": "Hello, World!"}


def test_create_and_get_note():
    # assert there are no note currently or this user
    assert [] == Notes.get_notes('', USER)
    note = dict(id='1234', title='title text', body='body text', folder='unknown folder')
    Notes.create_or_modify_note(note, user_id=USER)
    saved_note = Notes.get_note(note['id'], USER)
    for k, value in note.items():
        assert value == saved_note[k]
    # now just verify it also works when retrieving from all notes
    all_notes = Notes.get_notes('', USER)
    saved_note = all_notes[0]
    for k, value in note.items():
        assert value == saved_note[k]


