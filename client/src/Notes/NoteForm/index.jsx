import React, { useCallback, useEffect } from "react"

import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Box, /* Button, */ TextField, useTheme } from "@mui/material"

import { useCreateNote, useSelectedNote, useUpdateNote } from "@/store/store-selectors"
import FlexColumn from "@/UI/FlexColumn"

const NoteFormComponent = ({ formik, isNewNote }) => {
  const { palette } = useTheme()
  const { dirty, handleChange, isSubmitting, isValid, setSubmitting, submitForm, touched, values } = formik
  // console.log("🚀 ~ file: index.jsx:15 ~ NoteFormComponent ~ isSubmitting:", isSubmitting)
  // console.log("🚀 ~ file: index.jsx:15 ~ NoteFormComponent ~ formik:", formik)
  // console.log("🚀 ~ file: index.jsx:15 ~ NoteFormComponent ~ values:", values)
  // console.log("🚀 ~ file: index.jsx:16 ~ NoteFormComponent ~ isValid:", isValid)
  // console.log("🚀 ~ file: index.jsx:17 ~ NoteFormComponent ~ dirty:", dirty)

  const titleInput = document.getElementById('title')

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

  const debouncedSubmit = useCallback(fn => {
    let timer
    return (async () => {
      clearTimeout(timer)
      timer = await setTimeout(() => fn(), 2000)
      setSubmitting(false)
    })()
  }, [setSubmitting])

  useEffect(() => {
    if (dirty && isValid && !isSubmitting) {
      debouncedSubmit(submitForm)
    }
  }, [debouncedSubmit, dirty, isSubmitting, isValid, submitForm])

  useEffect(() => {
    if (Object.keys(touched).length) {
      return setSubmitting(true)
    }
  }, [setSubmitting, touched])
  
  return (
    <Box display='flex' flexDirection='column' gap='1rem'>
      <TextField
        fullWidth
        multiline
        id='title'
        name='title'
        variant='standard'
        value={values?.title ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root-MuiInput-root]': {
              color: palette.secondary[400],
              fontWeight: '700',
              fontSize: '1.25rem'
            },
          '& [class*=MuiInputBase-root-MuiInput-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:after': { border: 'none' },
          '& [class*=MuiFormLabel-root-MuiInputLabel-root]': { color: palette.secondary[200] },
          '& [class*=MuiFormLabel-root-MuiInputLabel-root].Mui-focused': { color: palette.secondary[400] },
        }}
      />
      <TextField
        fullWidth
        multiline
        id='body'
        name='body'
        variant='standard'
        value={values.body?.trimStart() ?? ''}
        onChange={handleChange}
        disabled={!values.title}
        sx={{
          '& [class*=MuiInputBase-root-MuiInput-root]': { color: palette.grey[400] },
          '& [class*=MuiInputBase-root-MuiInput-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root-MuiInput-root]:after': { border: 'none' },
        }}
      />
      {/* <Button
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
      </Button> */}
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
      body: PropTypes.string
    })
  })),
  isNewNote: PropTypes.bool,
  setIsNewNote: PropTypes.func,
}

export default NoteForm