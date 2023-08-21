import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Form, Formik } from 'formik'
import * as yup from 'yup'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { INITIAL_NOTE } from '@/constants/constants'
import Drawer from '@/Drawer'
import useCreateNote from '@/hooks/useCreateNote'
import useGetNote from '@/hooks/useGetNote'
import useGetNotes from '@/hooks/useGetNotes'
import useUpdateNote from '@/hooks/useUpdateNote'
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

const Notes = React.memo(() => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const { palette } = useTheme()
  const screenSize = useScreenSize()

  // Store
  const currentNote = useStore((store) => store.currentNote)
  const setCurrentNote = useStore((store) => store.setCurrentNote)
  const isNewNote = useStore((store) => store.isNewNote)
  const setIsNewNote = useStore((store) => store.setIsNewNote)
  const selectedNoteID = useStore((store) => store.selectedNoteID)
  const setSelectedNoteID = useStore((store) => store.setSelectedNoteID)
  const selectedFolderID = useStore((store) => store.selectedFolderID)
  
  // Api query
  const { data: notes } = useGetNotes()
  const { data: note } = useGetNote(selectedNoteID)
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  
  const isSelectedInNotes = useMemo(() => Boolean(notes?.length && notes?.some(note => note.id === selectedNoteID)), [notes, selectedNoteID])

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

  const handleSubmit = useCallback(
    (values) => {
      console.log('SUBMIT')
      console.log('[values]:', values)
      // For a new note either, submit immediatley or wait a much longer period to submit.
      isNewNote && values?.id
        ? createNote.mutate(values)
        : updateNote.mutate(values)

      setSelectedNoteID(values.id)
      setIsNewNote(false)
    },
    [createNote, isNewNote, setIsNewNote, setSelectedNoteID, updateNote]
  )

  const count = useRef(0)
  useEffect(() => {
    console.log('2.Notes index useEffect ')
    console.log('  [count]:', count.current += 1)
    console.log('  [selectedFolderID]: ', selectedFolderID, '[isNewNote]: ', isNewNote)
    console.log("  [selectedNoteID]:", selectedNoteID)
    console.log("  [isSelectedInNotes]:", isSelectedInNotes)
    console.log("  [currentNote]:", currentNote)
    console.log('  [notes]:', notes)
    console.log('  [note]:', note)
    
    if (currentNote?.folder && currentNote?.folder !== selectedFolderID && !isSelectedInNotes) {
      console.log('  Parallel first step for out of sync values with NoteList')
      console.log("  folder ids don't match and we have a current note folder id and selected note is not in notes")
      console.log('  Setting selected note id and current note to defaults')
      setCurrentNote(INITIAL_NOTE)
      setSelectedNoteID(null)
    }

    if (selectedFolderID && isNewNote) {
      // when creating a new note, create new ID and set 
      let id = (crypto?.randomUUID() || '').replaceAll('-', '')
      console.log('  We have a selected folder id and its a new note')
      console.log('  Updating current note with folder id and a new cyrpto id.')
      console.log('  [selectedFolderID]', selectedFolderID, '[crypto id]', id)
      setCurrentNote({
        ...INITIAL_NOTE,
        folder: selectedFolderID,
        id: id
      })
      // Must have a selected note on first load to stop this id from being set and making an api call
      console.log('  Also setting selected note id to: ', id)
      return setSelectedNoteID(id)
    }
    // if (selectedFolderID && !isNewNote && note) {
    //   setCurrentNote(note)
    // }
  }, [selectedFolderID, isNewNote, setCurrentNote, setSelectedNoteID, isSelectedInNotes])

  return (
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
        <Formik
          enableReinitialize
          key={note?.id ?? currentNote?.id}
          initialValues={selectedFolderID && !isNewNote ? note : currentNote} // Determine which note values to use for initialvalues.
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {formik => (
            <Form onSubmit={handleSubmit}>
              <NoteForm formik={formik}/>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  )
})

Notes.displayName = '/Notes'

export default Notes