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
  - Create a note
  - Get a note by id
  - Get all notes
  - Delete a note by id
    - Use delete icon on the item row
  - Delete all checked notes
    - Use the check boxes on each item row to select multiple notes or
    - Use the select all check box to select all notes
    - Then select the top level delete icon
###### Still ToDo
  Phase 1
  - Finish CRUD
    - Update a note
      - Will have to set `selectedNote` as the formik initial values
    - Search notes(by title and/or body)
      - Add Search input (possibly in the <ListHeader /> component)
  - Replace the NoteView with the NoteForm
    - We should always be in an active form state
    - Form should be aware that it's either a new note or edit note
  - Form UI needs to be styled
    - Page lines or no page lines
    - Probably drop the input outlines
    - Text color
  - Create first note automatically:
    - When there are no notes
  - Responsive styling
    - Fix styling widths for note list and note form
    - Tablet: turn note list into a mui popover or drawer
    - Mobile: put note list into a menu icon w/ drop down menu list
  - Create reusable component for page header (below nav)
  - Refactor the form submit to be a debounced auto save
  - First line of the note (any text before the first page break) automatically:
    - Gets set as the `title`
    - Gets styled with increased font size and weight
  
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