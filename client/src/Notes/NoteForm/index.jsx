import React, { useCallback, useEffect, useMemo, useRef } from "react"

import { Form, Formik } from 'formik'
import { PropTypes } from 'prop-types/prop-types'
import * as yup from 'yup'

import { Description as DescriptionIcon } from '@mui/icons-material'
import { Box, TextField, Typography, useTheme } from "@mui/material"

import useCreateNote from '@/hooks/useCreateNote'
import useUpdateNote from '@/hooks/useUpdateNote'
import useNotes from '@/hooks/useNotes'
import useFolders from '@/hooks/useFolders'
import { useScreenSize, useStore } from "@/store/store"
import EmptyState from '@/UI/EmptyState'

const NoteFormComponent = ({ formik, isNewNote }) => {
  const { palette } = useTheme()
  const { data: folders = [] } = useFolders()
  const screenSize = useScreenSize()
  const {handleChange, submitForm, values } = formik

  const form = document.getElementById('form')
  const titleInput = document.getElementById('title')

  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const Icon = () => <DescriptionIcon />
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
  }, [isNewNote, titleInput])
  
  useEffect(() => {
    if (titleInput) {
      titleInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          document.getElementById("body").focus({ focusVisible: true })
        }
      })
    }
  }, [titleInput])

  if (!folders?.length) {
    if (isDesktop) {
      return (
        <Typography
          sx={{
            color: palette.grey[400],
            textAlign: 'center',
            paddingTop: '3rem'
          }}
        >
          Add a new folder to get started
        </Typography>
      )
    }
      return <EmptyState EmptyIcon={Icon} text='Add a new folder to get started' />
  }
  
  return (
    <Box
      id='form'
      display='flex'
      flexDirection='column'
    >
      <TextField
        fullWidth
        multiline
        id='title'
        name='title'
        variant='standard'
        placeholder='Well, hello there.'
        value={values?.title ?? ''}
        onChange={handleChange}
        sx={{
          '& [class*=MuiInputBase-root]': {
              color: palette.secondary[400],
              fontWeight: '700',
              fontSize: '1.25rem',
              padding: 0
            },
          '& [class*=MuiInputBase-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root]:after': { border: 'none' },
          '& [class*=MuiFormLabel-root]': { color: palette.secondary[200] },
          '& [class*=MuiFormLabel-root].Mui-focused': { color: palette.secondary[400] },
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
        sx={{
          '& [class*=MuiInputBase-root]': { color: palette.grey[400], padding: 0, alignItems: 'initial' },
          '& [class*=MuiInputBase-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root]:after': { border: 'none' },
        }}
      />
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

const NoteForm = React.memo(() => {
  const isNewNote = useStore(store => store.isNewNote)
  const selectedNote = useStore(store => store.selectedNote)
  console.log("🚀 ~ file: index.jsx:165 ~ NoteForm ~ selectedNote:", selectedNote)
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const selectedFolderID = useStore(store => store.selectedFolderID)
  const { data: notes } = useNotes()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  
  const handleSubmit = useCallback(values => {
    isNewNote
      ? createNote.mutate(values)
      : updateNote.mutate(values)
    
    setIsNewNote(false)
  }, [createNote, isNewNote, setIsNewNote, updateNote])

  const initialValues = getInitialValues({ isNewNote, selectedNote, selectedFolderID })

  useEffect(() => {
    // Need to watch for loading as well
    // Like if (loading) return
    if (!notes?.length) {
      setIsNewNote(true)
    } else {
      setIsNewNote(false)
    }
  }, [notes?.length, setIsNewNote])

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues ?? {}}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {formik => (
        <Form onSubmit={formik.handleSubmit}>
          <NoteFormComponent
            formik={formik}
            isNewNote={isNewNote}
          />
        </Form>
      )}
    </Formik>
  )
})

NoteForm.displayName = '/NoteFormWrapper'
// NoteForm.propTypes = {
//   notes: PropTypes.arrayOf(PropTypes.shape({
//     note: PropTypes.shape({
//       id: PropTypes.string,
//       title: PropTypes.string,
//       body: PropTypes.string,
//       folder: PropTypes.string,
//     })
//   }))
// }

export default NoteForm