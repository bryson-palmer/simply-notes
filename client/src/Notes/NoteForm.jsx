import React, { useEffect, useMemo, useRef } from "react"
import { PropTypes } from 'prop-types/prop-types'

import DescriptionIcon from '@mui/icons-material/Description'
import { useTheme } from "@mui/material"
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import useGetNote from '@/hooks/useGetNotes'
import useGetFolders from '@/hooks/useGetFolders'
import { useScreenSize, useStore } from "@/store/store"
import EmptyState from '@/UI/EmptyState'

const NoteForm = React.memo(({formik}) => {
  const { palette } = useTheme()

  // Api query
  const { data: folders = [] } = useGetFolders()
  const { isLoading } = useGetNote()

  // Store
  const screenSize = useScreenSize()
  const isNewNote = useStore(store => store.isNewNote)
  const {dirty, handleChange, isSubmitting, submitForm, values } = formik

  const form = document.getElementById('form')
  const titleInput = document.getElementById('title')

  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const Icon = () => <DescriptionIcon />
  let timer = useRef(0)

  useEffect(() => {
    console.log('3.Auto saving note form')
    // if (isNewNote && Boolean(values?.id)) {
    //   submitForm() 
    // }
    const handleKeyPress = () => clearTimeout(timer.current)

    const handleKeyUp = () => {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        // If values haven't changed
        // Or we're currently submitting bail on this submission
        if (isSubmitting || isLoading) return
        return submitForm()
      }, 500)
    }

    if (form) {

      form.addEventListener('keypress', () => handleKeyPress(timer))
      form.addEventListener('keyup', () => handleKeyUp(timer))
    }
  }, [dirty, form, isLoading, isNewNote, isSubmitting, submitForm, values?.id])

  // Focus the title input if we have a new note
  useEffect(() => {
    if (Boolean(titleInput) && isNewNote) return titleInput.focus({ focusVisible: true })
  }, [isNewNote, titleInput])
  
  // Listen for when a user enters out of the title input and put them in the body input
  useEffect(() => {
    if (titleInput) {
      titleInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          document.getElementById("body").focus({ focusVisible: true })
        }
      })
    }
  }, [titleInput])

  // useEffect(() => {
  //   // Need to watch for loading as well
  //   // Like if (loading) return
  //   if (!notes?.length) {
  //     setIsNewNote(true)
  //   } else {
  //     setIsNewNote(false)
  //   }
  // }, [notes?.length, setIsNewNote])

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
        autoFocus
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
        value={values?.body?.trimStart() ?? ''}
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
})

NoteForm.displayName = '/NoteForm'
NoteForm.propTypes = {
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
}

export default NoteForm