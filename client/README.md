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
- Axios
- React Context Selector
- Material UI
- React Router Dom
- Formik

### MVP Features
###### Completed
  - CRUD
    - Get all notes
    - Get a note by id
    - Update note by id
    - Delete many notes
    - Delete a note by id
  - Selected note is always in the active form state
  - Set new note (create note) automatically when there are no notes
###### Still ToDo
  Phase 1
  - Search notes(by title and/or body)
    - Add Search input (possibly in the <ListHeader /> component)
  - Refactor the form submit to be a debounced auto save
  - Convert to using only one TextField `name='body'`.
    - Split value by `value.split('\n')`
    - Set value[0] as the `title`
      - Style title with increased font size and weight
    - Set value[1] as the `body`
  - Form UI needs to be styled
    - Page lines or no page lines
    - Element colors
  - Responsive styling
    - Fix styling widths for note list and note form
    - Tablet: turn note list into a mui popover or drawer
    - Mobile: put note list into a hamburger menu icon w/ drop down menu list
  - Create reusable component for page header (below nav)
  
  Phase 2
  - Add a login/sign up view
  - Possibly a user account and or global settings (light/dark mode)
  - Integrate authentication (username/password/tokens)
    - Start basic and then build better production level auth
    - Stretch goal! multi factor authentication

  Phase 3
  - Host the front end somewhere (possibly Vercel)

  Phase 4
  - Stretch goals!
    - Integrate ChatGPT
    - PWA (progressive web app)
    - Offline mode with localStorage