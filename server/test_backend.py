# test_app.py

import pytest
from bs4 import BeautifulSoup
from app import app
import notes as Notes
import folders as Folders

USER = 'USER_ID'

@pytest.fixture
def client():
    # flask built-in that allows you to query the backend with this test-client
    app.testing = True
    with app.test_client() as client:
        yield client

def delete_all_notes():
    notes = Notes.get_notes('', USER)
    note_ids = [note['id'] for note in notes]
    Notes.delete_notes(note_ids, USER)

def delete_all_folders():
    folders = Folders.get_folders(USER)
    folder_ids = [folder['id'] for folder in folders]
    Folders.delete_folders(folder_ids, USER)

@pytest.fixture(autouse=True)
def setup_and_teardown():
    ''' pytest fixture abuse that's well accepted. Used to perform setup & teardown for each test '''
    # do set up stuff here
    delete_all_notes()
    delete_all_folders()
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

def test_default_folder_exists():
    ''' default folder should automatically exist'''
    default_folders = Folders.get_folders(USER)
    assert len(default_folders) == 1

def test_create_get_delete_folder():
    id = '4321'
    name = 'Cannon Folder'
    Folders.create_folder(id, name, USER)
    folders = Folders.get_folders(USER)
    # we may or may not have default folders, so just filter out the default folder if so
    our_folder = [f for f in folders if f['id'] == id]  # it's a list
    assert our_folder[0]['foldeName'] == name
    Folders.delete_folders([id], USER)
    # verify folder is gone
    folders = Folders.get_folders(USER)
    our_folder = [f for f in folders if f['id'] == id]
    assert not our_folder

def test_1_folder_always_exists():
    ''' just testing that default folder exists even if we try to delete it.
        But if we have another folder, then we CAN delete it
    '''
    delete_all_folders()
    folders = Folders.get_folders(USER)
    assert len(folders) == 1
    og_folder_id = folders[0]['id']
    Folders.create_folder('folder id', 'folder name', USER)
    folders = Folders.get_folders(USER)
    assert len(folders) == 2
    assert [f for f in folders if f['id'] == og_folder_id]
    Folders.delete_folders([og_folder_id], USER)
    folders = Folders.get_folders(USER)
    assert len(folders) == 1
    assert not [f for f in folders if f['id'] == og_folder_id]




