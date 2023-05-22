import React, { useCallback, /* useTheme */ } from "react"

import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Button } from "@mui/material"
import { TextField } from "@mui/material"

import { useCreateNote, useSelectedNote } from "@/store/store-selectors"
import FlexColumn from "@/UI/FlexColumn"

const NoteFormComponent = ({ formik }) => {
  // const { palette } = useTheme()
  const { dirty, handleChange, isValid, values } = formik
  console.log("🚀 ~ file: index.jsx:16 ~ NoteFormComponent ~ values:", values)

  return (
    <FlexColumn isNote>
      <TextField
        fullWidth
        id='title'
        name='title'
        label='title'
        variant='standard'
        value={values?.title ?? ''}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        multiline
        id='body'
        name='body'
        variant='standard'
        value={values?.body ?? ''}
        onChange={handleChange}
      />
      <Button
        disabled={!dirty || !isValid}
        color="primary"
        variant="contained"
        type="submit"
      >
        Submit
      </Button>
    </FlexColumn>
  )
}

NoteFormComponent.displayName = '/NoteForm'
NoteFormComponent.propTypes = {
  formik: PropTypes.shape({
    dirty: PropTypes.bool,
    handleChange: PropTypes.func,
    isValid: PropTypes.bool,
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

const getInitialValues = ({ isNewNote, selectedNote }) => {
  return (isNewNote ? { id: '', title: '', body: '' } : selectedNote )
}

const NoteForm = React.memo(({ isNewNote=false, setIsNewNote={} }) => {
  const selectedNote = useSelectedNote()
  console.log("🚀 ~ file: index.jsx:80 ~ NoteForm ~ selectedNote:", selectedNote)
  const createNote = useCreateNote()
  
  const handleSubmit = useCallback(async values => {
    await createNote(values)
    setIsNewNote(false)
  }, [createNote, setIsNewNote])

  const initialValues = getInitialValues({ isNewNote, selectedNote })

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues ?? {}}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit}>
          <NoteFormComponent formik={formik} />
        </Form>
      )}
    </Formik>
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
  isNewNote: PropTypes.bool,
  setIsNewNote: PropTypes.func,
}

export default NoteForm