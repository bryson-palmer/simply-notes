import React, { useCallback, useEffect, useRef } from "react"

import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Box, TextField, useTheme } from "@mui/material"

import { useCreateNote, useSelectedNote, useUpdateNote, useSelectedFolderID } from "@/store/store-selectors"
import FlexColumn from "@/UI/FlexColumn"

const NoteFormComponent = ({ formik, isNewNote }) => {
  const { palette } = useTheme()
  const {handleChange, submitForm, values } = formik

  const form = document.getElementById('form')
  const titleInput = document.getElementById('title')

  let timer = useRef(0)

  useEffect(() => {
    const handleKeyPress = () => clearTimeout(timer.current)

    const handleKeyUp = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => submitForm(), 300)
    }

    if (form) {
      form.addEventListener('keypress', () => handleKeyPress(timer))
      form.addEventListener('keyup', () => handleKeyUp(timer))
    }
  }, [form, submitForm])

  useEffect(() => {
    if (Boolean(titleInput) && isNewNote) return titleInput.focus({ focusVisible: true })
  }, [isNewNote, titleInput, values.title])
  
  useEffect(() => {
    if (titleInput) {
      titleInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          document.getElementById("body").focus({ focusVisible: true })
        }
      })
    }
  }, [titleInput])
  
  return (
    <Box id='form' display='flex' flexDirection='column'>
      <TextField
        fullWidth
        multiline
        id='title'
        name='title'
        variant='standard'
        placeholder='What would you like ToDo?'
        value={values?.title ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root]': {
              color: palette.secondary[400],
              fontWeight: '700',
              fontSize: '1.25rem'
            },
          '& [class*=MuiInputBase-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root]:after': { border: 'none' },
          '& [class*=MuiFormLabel-root]': { color: palette.secondary[200] },
          '& [class*=MuiFormLabel-root].Mui-focused': { color: palette.secondary[400] },
        }}
      />

      {isNewNote && !values.title ? null : (
        <TextField
          fullWidth
          multiline
          id='body'
          name='body'
          variant='standard'
          value={values.body?.trimStart() ?? ''}
          onChange={handleChange}
          sx={{
            '& [class*=MuiInputBase-root]': { color: palette.grey[400] },
            '& [class*=MuiInputBase-root]:before': { border: 'none' },
            '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
            '& [class*=MuiInputBase-root]:after': { border: 'none' },
          }}
        />
      )}
    </Box>
  )
}

NoteFormComponent.displayName = '/NoteForm'
NoteFormComponent.propTypes = {
  formik: PropTypes.shape({
    dirty: PropTypes.bool,
    handleChange: PropTypes.func,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    setSubmitting: PropTypes.func,
    submitForm: PropTypes.func,
    touched: PropTypes.shape({
      id: PropTypes.bool,
      title: PropTypes.bool,
      body: PropTypes.bool
    }),
    values: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string
    })
  }),
  isNewNote: PropTypes.bool
}

const validationSchema = yup.object({
  id: yup
    .string('Must be a string'),
  title: yup
    .string('Enter a title'),
  body: yup
    .string('Enter a note'),
  folder: yup
    .string('Must be a string'),
})

const getInitialValues = ({ isNewNote, selectedNote, selectedFolderID }) => {
  return (isNewNote ? { id: '', title: '', body: '', folder: selectedFolderID } : selectedNote )
}

const NoteForm = React.memo(({ isNewNote=false, setIsNewNote={} }) => {
  const selectedNote = useSelectedNote()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const selectedFolderID = useSelectedFolderID()
  
  const handleSubmit = useCallback(values => {
    isNewNote
      ? createNote(values)
      : updateNote(values)
    
    setIsNewNote(false)
  }, [createNote, isNewNote, setIsNewNote, updateNote])

  const initialValues = getInitialValues({ isNewNote, selectedNote, selectedFolderID })

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
            <NoteFormComponent
              formik={formik}
              isNewNote={isNewNote}
            />
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
      body: PropTypes.string,
      folder: PropTypes.string,
    })
  })),
  isNewNote: PropTypes.bool,
  setIsNewNote: PropTypes.func,
}

export default NoteForm