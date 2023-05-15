# Simple ToDo Client Side
### This servers the front end of this full stack app.

##### Run the App
- Clone this repo
- Install app dependencies with yarn
- Start the front end with yarn dev
  - Check `http://localhost:5173`
- Start the db.json server with `npx json-server -p 3500 -w mockData/db.json`
  - Check `localhost:3500`
  - A temporary mock server to test endpoints

###### Front End Stack
- JavaScript
- React
- Axios
- React Context Selector
- Material UI
- React Router Dom
- Formik

##### MVP Features
- ###### Completed
  - Create a note
  - Get a note by id
  - Get all notes
  - Delete a note by id
    - Use delete icon on the item row
  - Delete all checked notes
    - Use the check boxes on each item row to select multiple notes or
    - Use the select all check box to select all notes
    - Then select the top level delete icon
- ###### Still ToDo
  - Update a note
  - Replace the NoteView with the NoteForm
    - We should always be in an active form state
  - Refactor the form submit to be a debounced auto save
  - First line of the note (any text before the first page break) automatically:
    - Gets set as the `title`
    - Gets styled with increased font size and weight
  - Form UI needs to be styled
  - Create first note:
    - When there are no notes