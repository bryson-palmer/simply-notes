# test_app.py

import pytest
from bs4 import BeautifulSoup
from app import app

@pytest.fixture
def client():
    # flask built-in that allows you to query the backend with this test-client
    app.testing = True
    with app.test_client() as client:
        yield client

def test_home_endpoint_looks_like_html(client):
    ''' home endpoint returns html that loads the front-end code '''
    response = client.get('/')
    assert response.status_code == 200
    html_text = response.data.decode('utf-8')
    soup = BeautifulSoup(html_text, 'html.parser')
    assert soup.find('html') or soup.find('body')
    #assert response.get_json() == {"message": "Hello, World!"}

