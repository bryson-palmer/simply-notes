import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { Form, Formik } from 'formik'
import * as yup from 'yup'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import { ALL_NOTES_ID, INITIAL_NOTE } from '@/constants/constants'
import Drawer from '@/Drawer'
import useCreateNote from '@/hooks/useCreateNote'
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
  
  // Store
  const screenSize = useScreenSize()
  const currentNote = useStore((store) => store.currentNote)
  const setCurrentNote = useStore((store) => store.setCurrentNote)
  const isNewNote = useStore((store) => store.isNewNote)
  const setIsNewNote = useStore((store) => store.setIsNewNote)
  const selectedNoteID = useStore((store) => store.selectedNoteID)
  const setSelectedNoteID = useStore((store) => store.setSelectedNoteID)
  const selectedFolderID = useStore((store) => store.selectedFolderID)
  const setNoteByFolderID = useStore(store => store.setNoteByFolderID)
  const noteByFolderID = useStore(store => store.noteByFolderID)
  
  // Api query
  const { data: notes, isFetching: notesIsFetching, isLoading: notesIsLoading } = useGetNotes()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()

  const noteID = useMemo(() => noteByFolderID[selectedFolderID], [noteByFolderID, selectedFolderID])
  const lookupNote = useMemo(() => notes?.find(note => note?.id === noteID), [noteID, notes])
  const isLookupIdInList = useMemo(() => notes?.some(note => note?.id === noteID), [noteID, notes])
  const isCurrentIdInNotes = useMemo(() => notes?.some(note => note?.id === currentNote?.id), [currentNote?.id, notes])

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
    console.log('[SUBMIT]')
    console.log('[values]:', values)
    // For a new note either, submit immediatley or wait a much longer period to submit.
    isNewNote && values?.id
      ? createNote.mutate(values)
      : updateNote.mutate(values)

    setSelectedNoteID(values.id)
    setIsNewNote(false)
  }, [createNote, isNewNote, setIsNewNote, setSelectedNoteID, updateNote])

  // console.log(
  //   '[COMPONENT_SCOPE]',
  //   {
  //     'isNewNote': isNewNote,
  //     'notesIsLoading': notesIsLoading,
  //     'notesIsFetching': notesIsFetching,
  //     'notes': notes,
  //     'currentNote': currentNote,
  //     'selectedFolderID': selectedFolderID,
  //     'selectedNoteID': selectedNoteID,
  //     'noteID': noteID,
  //     'noteByFolderID': noteByFolderID,
  //     'isCurrentIdInNotes': isCurrentIdInNotes,
  //     'isLookupIdInList': isLookupIdInList,
  //   }
  // )

  useEffect(() => {
    // This useEffect is addressing loading a note after a new folder is selected
    if (notesIsLoading || noteIsLoading) return
    console.log('1.Notes index useEffect ')

    // We don't reload the currentNote if the ids are the same to avoid flickering
    // If the ids aren't then we sync up currentNote with the note
    if (!isNewNote && note?.id !== currentNote?.id) {
      console.log('  Setting currentNote to note')
      setCurrentNote(note)
      return
    }
  }, [currentNote?.id, isNewNote, note, noteIsLoading, notesIsLoading, setCurrentNote])

  useEffect(() => {
    // This useEffect is adding a new note id and syncing the folder id to the new note
    console.log('2.Notes index useEffect ')
    if (isNewNote && selectedFolderID) { // && selectedNoteID !== currentNote?.id
      let id = (crypto?.randomUUID() || '').replaceAll('-', '')
      console.log('  New note')
      console.log('  Updating currentNote with folder id and a new cyrpto id.')
      console.log('  [selectedFolderID]', selectedFolderID, '[crypto id]', id)
      setCurrentNote({
        ...INITIAL_NOTE,
        folder: selectedFolderID,
        id: id
      })
      // Must have a selected note on first load to stop this id from being set and making an api call
      return setSelectedNoteID(id)
    }
  }, [isNewNote, selectedFolderID, setCurrentNote, setSelectedNoteID])

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
            id='toggleDrawer'
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
          initialValues={selectedFolderID && !isNewNote ? note : {...currentNote}} // Determine which note values to use for initialvalues.
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