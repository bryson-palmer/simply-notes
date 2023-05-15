import React, { useCallback, useMemo /* useTheme */ } from "react"

import { useFormik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Button } from "@mui/material"
import { TextField } from "@mui/material"

import { useNotes, useCreateNote } from "@/store/store-selectors"
import FlexColumn from "@/UI/FlexColumn"

const NoteFormComponent = ({ formik }) => {
  // const { palette } = useTheme()
  const { handleChange, values } = formik

  return (
    <FlexColumn isNote>
      <TextField
        fullWidth
        id='title'
        name='title'
        label='title'
        variant='standard'
        value={values.title}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        multiline
        id='body'
        name='body'
        // label='body'
        variant='standard'
        value={values.body}
        onChange={handleChange}
      />
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit
      </Button>
    </FlexColumn>
  )
}

NoteFormComponent.displayName = '/NoteForm'
NoteFormComponent.propTypes = {
  formik: PropTypes.shape({
    handleChange: PropTypes.func,
    values: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string
    })
  })
}

const validationSchema = yup.object({
  id: yup
    .string('Must be a string'),
  title: yup
    .string('Enter a title'),
  body: yup
    .string('Enter a note')

})

const initialValues = {
  id: '',
  title: '',
  body: ''
}

const NoteForm = React.memo(({ setAddNote }) => {
  const notes = useNotes()
  const createNote = useCreateNote()
  const newNoteId = useMemo(() => {
    // Create new id by grabbing the last note from db by id and add one or 1st note
    const newId = notes.length ? notes[notes.length -1].id + 1 : 1
    return newId
  }, [notes])
  
  const handleSubmit = useCallback(async values => {
    const newValues = { ...values, id: newNoteId}
    await createNote(newValues)
    setAddNote(false)
  }, [createNote, newNoteId, setAddNote])

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <NoteFormComponent formik={formik} />
      </form>
    </>
  )
})

NoteForm.displayName = '/NoteFormWrapper'
NoteForm.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    note: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string
    })
  })),
  setAddNote: PropTypes.func,
  selectedNote: PropTypes.func
}

export default NoteForm