import { useCallback, useContext, useEffect, /* useTheme */ } from "react"

import { useFormik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import { v4 as uuid} from 'uuid'
import * as yup from 'yup'

import { Button } from "@mui/material"
import { TextField } from "@mui/material"

import FlexColumn from "@/UI/FlexColumn"
import { StoreContext } from '@/Providers/store.provider'

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
        value={values.title}
        onChange={handleChange}
      />
      <TextField
        fullWidth
        id='body'
        name='body'
        label='body'
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
  }),
  setSelectedNote: PropTypes.func
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

const NoteForm = ({ notes, setAddNote, setSelectedNote }) => {
  const { createNote } = useContext(StoreContext)
  
  const handleSubmit = useCallback(async values => {
    const newValues = { ...values, id: uuid()}
  
    await createNote(newValues)
    setAddNote(false)
  }, [createNote, setAddNote])

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit
  })

  useEffect(() => {
    if (formik.isSubmitting && formik.isValid) {
      const selectedNote = notes[notes.length - 1]

    setSelectedNote(selectedNote)
    }
  }, [formik.isSubmitting, formik.isValid, notes, setSelectedNote])

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <NoteFormComponent formik={formik} />
      </form>
    </>
  )
}

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
  setSelectedNote: PropTypes.func
}

export default NoteForm