import React, { useCallback } from "react"

import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Box, Button, TextField, useTheme } from "@mui/material"

import { useCreateNote, useSelectedNote, useUpdateNote } from "@/store/store-selectors"
import FlexColumn from "@/UI/FlexColumn"

const NoteFormComponent = ({ formik }) => {
  const { palette } = useTheme()
  const { dirty, handleChange, isValid, values } = formik

  return (
    <Box display='flex' flexDirection='column' gap='1rem'>
      <TextField
        fullWidth
        id='title'
        name='title'
        label='Title'
        variant='standard'
        value={values?.title ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root-MuiInput-root]': { color: palette.grey[400] },
          '& [class*=MuiInputBase-root-MuiInput-root]:before': { borderColor: palette.grey[600] },
          '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before': { borderColor: palette.secondary[300] },
          '& [class*=MuiInputBase-root-MuiInput-root]:after': { borderColor: palette.secondary[400] },
          '& [class*=MuiFormLabel-root-MuiInputLabel-root]': { color: palette.secondary[300] },
        }}
      />
      <TextField
        fullWidth
        multiline
        id='body'
        name='body'
        variant='standard'
        value={values?.body ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root-MuiInput-root]': { color: palette.grey[400] },
          '& [class*=MuiInputBase-root-MuiInput-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:after': { border: 'none' },
        }}
      />
      <Button
        disabled={!dirty || !isValid}
        // color="primary"
        variant="contained"
        type="submit"
        sx={{
          // '& [class*=MuiButtonBase-root-MuiButton-root]:hover': {
          //   backgroundColor: palette.tertiary[200]
          // }
        }}
      >
        Submit
      </Button>
    </Box>
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
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  
  const handleSubmit = useCallback(async values => {
    isNewNote
      ? await createNote(values)
      : await updateNote(values)
    
    setIsNewNote(false)
  }, [createNote, isNewNote, setIsNewNote, updateNote])

  const initialValues = getInitialValues({ isNewNote, selectedNote })

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues ?? {}}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {formik => (
        <FlexColumn isNote>
          <Form onSubmit={formik.handleSubmit}>
            <NoteFormComponent formik={formik} />
          </Form>
        </FlexColumn>
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