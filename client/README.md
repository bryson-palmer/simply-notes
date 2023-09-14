# Simple ToDo Client Side
##### This serves the front end of this full stack app.

### Run the App
- Clone this repo
- Install app dependencies with yarn
- Start a local front end instance with `yarn dev`
  - Check `http://localhost:5173`
- Start a local back end instance with `python3 app.py`
  - Check `http://127.0.0.1:5000`

###### Front End Stack
- JavaScript
- React
- React Router Dom
- Axios
- React Query
- Zustand
- Formik
- Material UI

### MVP Features
###### Completed
  - CRUD
    - Folders
      - Get, Create/Update, & Delete
    - Notes
      - Create a note
      - Get all notes
      - Get a note by id
      - Update note by id
      - Delete a note by id
      - Delete many notes
  - Selected note is always in the active form state
  - Set new note (create note) automatically when there are no notes
  - Refactor the form submit to be a debounced auto save
  - Session cookie authentication
  - React Query wraps all axios calls and handles server state
  - Zustand store for client state
  - Hosting
    - App is hosted at fly.io
      https://simple-notes.fly.dev/
###### Still ToDo
  Phase 1
  - Search notes(by title and/or body)
    - Add Search input (possibly in the <ListHeader /> component)
  
  Phase 2
  - Add a login/sign up view
  - Possibly a user account and or global settings (light/dark mode)
  - Integrate authentication (username/password/tokens)
    - Start basic and then build better production level auth
    - Stretch goal! multi factor authentication

  Phase 4
  - Stretch goals!
    - Integrate ChatGPT
    - PWA (progressive web app)
    - Offline mode with localStorage