import React, { useCallback, useEffect, useState } from 'react'

import { Form, Formik } from 'formik'
import * as yup from 'yup'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Drawer from '@/Drawer'
import useCreateNote from '@/hooks/useCreateNote'
import useUpdateNote from '@/hooks/useUpdateNote'
import useGetNote from '@/hooks/useGetNote'
import NoteForm from '@/Notes/NoteForm'
import { useScreenSize, useStore } from '@/store/store'

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

const INITIAL_NOTE = {
  body: '',
  folder:  null,
  id: null,
  title: '',
}

const Notes = React.memo(() => {
  const [openDrawer, setOpenDrawer] = useState(false)
  
  const { palette } = useTheme()
  const screenSize = useScreenSize()
  // Store
  const isNewNote = useStore(store => store.isNewNote)
  console.log("🚀 ~ file: index.jsx:36 ~ Notes ~ isNewNote:", isNewNote)
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  console.log("🚀 ~ file: index.jsx:46 ~ Notes ~ selectedNoteID:", selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  const selectedFolderID = useStore(store => store.selectedFolderID)

  // Api query
  const { data: note } = useGetNote(selectedNoteID)
  console.log("🚀 ~ index.jsx:50 ~ Notes ~ [note?.id]:", note?.id)
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()

  const [newNoteState, setSelectedNote] = useState(INITIAL_NOTE)
  console.log("🚀 ~ index.jsx:37 ~ Notes ~ [newNoteState.id]:", newNoteState?.id)

  const isDesktop = screenSize === 'large' || screenSize === 'desktop'
  const drawerWidth = () => {
    if (screenSize === 'large') return 600
    if (screenSize === 'tablet') return 500
    if (screenSize === 'desktop' || screenSize === 'mobile') return 400
  }

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setOpenDrawer(!openDrawer)
  }

  const handleSubmit = useCallback(values => {
    console.log('SUBMIT: handling submit')
    console.log("🚀 ~ file: index.jsx:72 ~ handleSubmit ~ values:", values)
    // For a new note either, submit immediatley or wait a much longer period to submit.
    console.log("🚀 ~ file: index.jsx:74 ~ handleSubmit ~ isNewNote:", isNewNote)
    console.log("🚀 ~ file: index.jsx:75 ~ Notes ~ selectedNoteID:", selectedNoteID)
    isNewNote && values?.id
      ? createNote.mutate(values)
      : updateNote.mutate(values)
    

    setSelectedNoteID(values.id)
    setIsNewNote(false)

  }, [createNote, isNewNote, selectedNoteID, setIsNewNote, setSelectedNoteID, updateNote])
  
  useEffect(() => {
    console.log('4.Updating newNoteState with folder id and a new cyrpto id.')
    if (selectedFolderID && isNewNote) {
      setSelectedNote(prev => ({
        ...prev,
        folder: selectedFolderID,
        id: (crypto?.randomUUID() || '').replaceAll('-', '')
      }))
    }
  }, [isNewNote, selectedFolderID])
  
  return (
    <Formik
      enableReinitialize
      key={note?.id}
      initialValues={selectedFolderID && !isNewNote ? note : newNoteState}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          <Box
            display='flex'
            justifyContent='flex-end'
            height='100vh'
            overflow='hidden'
            flexDirection={isDesktop ? 'row' : 'column'}
          >
            <Box
              component='aside'
              aria-label='folders notes'
              transition='all 0.35s ease-in-out'
            >
              <Box
                height='3.75rem'
                paddingLeft='0.5rem'
                transition='all 0.35s ease-in-out'
              >
                <Button
                  disableRipple
                  onClick={toggleDrawer}
                  startIcon={<ArrowBackIosNewIcon />}
                  sx={{
                    display: { sm: 'flex', md: 'none' },
                    justifyContent: 'flex-start',
                    color: palette.grey[400],
                    fontSize: { xs: '0.6rem', sm: '0.75rem' },
                    '&:hover': { color: palette.secondary[100] },
                    '& [class*=MuiButton-startIcon]': {
                      marginRight: '6px',
                      '& > svg': {
                        fontSize: { xs: '1.2rem', sm: '1.5rem', md: 'none' },
                      },
                    },
                  }}
                >
                  Folders
                </Button>
              </Box>

              <Drawer
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                drawerWidth={drawerWidth}
              />
            </Box>
            <Box
              component='main'
              sx={{
                width: isDesktop ? `calc(100% - ${drawerWidth()}px)` : '100%',
                transition: 'all 0.35s ease-in-out',
                height: '93vh',
                overflow: 'auto',
                padding: isDesktop ? 3 : 3.5,
                paddingTop: isDesktop ? '60px' : 'initial',
              }}
            >
              <NoteForm />
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  )
})

Notes.displayName = '/Notes'

export default Notes