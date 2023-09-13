import React, { useCallback, useEffect, useRef } from 'react'
import { PropTypes } from 'prop-types/prop-types'

import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'

import useGetNotes from '@/hooks/useGetNotes'
import { useCurrentNote, useIsNewNote, useStore } from '@/store/store'

const NoteForm = React.memo(({ formik }) => {
  const { palette } = useTheme()

  // Api query
  const { isLoading: notesIsLoading } = useGetNotes()

  // Store
  const isNewNote = useIsNewNote()
  const currentNote = useCurrentNote()
  const { setCurrentNote } = useStore()
  const {dirty, isSubmitting, setValues, submitForm, values } = formik

  const form = document.getElementById('form')
  const titleInput = document.getElementById('title')

  const handleInputChange = useCallback(({ id, value }) => {
    /*
      Setting formik and currentNote values here so that we avoid fetching from the backend for the user's view of the note. Avoid the flicker!!!
    */
    // Set formik values
    setValues(prevValues => ({...prevValues,
      [id]: value}
    ))

    // Set currentNote store values
    setCurrentNote({
      ...values,
      [id]: value
    })
  }, [setCurrentNote, setValues, values])

  let timer = useRef(0)
  useEffect(() => {
    /*
      If values haven't changed, we're currently submitting,
      or notes are loading, then bail on this submission
    */
    if (!dirty || isSubmitting || notesIsLoading) return

    // if (isNewNote && Boolean(values?.id)) {
    //   submitForm() 
    // }

    const handleKeyPress = () => clearTimeout(timer.current)

    const handleKeyUp = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => submitForm(), 500)
    }

    if (form) {
      form.addEventListener('keypress', () => handleKeyPress(timer))
      form.addEventListener('keyup', () => handleKeyUp(timer))
    }
  }, [dirty, form, notesIsLoading, isNewNote, isSubmitting, submitForm, values?.id])

  // Focus the title input if we have a new note
  useEffect(() => {
    if (Boolean(titleInput) && isNewNote) return titleInput.focus({ focusVisible: true })
  }, [isNewNote, titleInput])
  
  // Listen for when a user enters out of the title input and put them in the body input
  useEffect(() => {
    if (titleInput) {
      titleInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          document.getElementById('body').focus({ focusVisible: true })
        }
      })
    }
  }, [titleInput])
  
  return (
    <Box
      id='form'
      display='flex'
      flexDirection='column'
    >
      <TextField
        autoFocus
        fullWidth
        multiline
        id='title'
        name='title'
        variant='standard'
        placeholder='Well, hello there.'
        value={currentNote?.title ?? ''}
        onChange={({ target }) => handleInputChange(target)}
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
        value={currentNote?.body?.trimStart() ?? ''}
        onChange={({ target }) => handleInputChange(target)}
        sx={{
          '& [class*=MuiInputBase-root]': { color: palette.grey[400], padding: 0, alignItems: 'initial' },
          '& [class*=MuiInputBase-root]:before': { border: 'none' },
          '& [class*=MuiInputBase-root]:hover:not(.Mui-disabled, .Mui-error):before': { border: 'none' },
          '& [class*=MuiInputBase-root]:after': { border: 'none' },
        }}
      />
    </Box>
  )
})

NoteForm.displayName = '/NoteForm'
NoteForm.propTypes = {
  formik: PropTypes.shape({
    dirty: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    isValid: PropTypes.bool,
    setValues: PropTypes.func,
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
}

export default NoteForm