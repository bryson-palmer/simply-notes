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
import { useCurrentNote, useIsNewNote, useNoteByFolderID, useScreenSize, useSelectedFolderID, useSelectedNoteID, useStore } from '@/store/store'

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
  const { setCurrentNote, setIsNewNote, setSelectedNoteID, setNoteByFolderID } = useStore()
  const currentNote = useCurrentNote()
  const isNewNote = useIsNewNote()
  const selectedNoteID = useSelectedNoteID()
  const selectedFolderID = useSelectedFolderID()
  const noteByFolderID = useNoteByFolderID()
  
  // Api query
  const { data: notes, isFetching: notesIsFetching, isLoading: notesIsLoading } = useGetNotes()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()

  const prevNoteID = useMemo(() => noteByFolderID[selectedFolderID], [noteByFolderID, selectedFolderID])
  const lookupNote = useMemo(() => notes?.find(note => note?.id === prevNoteID), [prevNoteID, notes])
  const isLookupIdInList = useMemo(() => notes?.some(note => note?.id === prevNoteID), [prevNoteID, notes])
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

    isNewNote && values?.id
      ? createNote.mutate(values)
      : updateNote.mutate(values)

    setSelectedNoteID(values.id)
    if (isNewNote) {
      setIsNewNote(false)
    }
  }, [createNote, isNewNote, setIsNewNote, setSelectedNoteID, updateNote])

  // console.log(
  //   '  [COMPONENT_SCOPE]',
  //   {
  //     'currentNote': currentNote,
  //     'isCurrentIdInNotes': isCurrentIdInNotes,
  //     'isLookupIdInList': isLookupIdInList,
  //     'isNewNote': isNewNote,
  //     'noteByFolderID': noteByFolderID,
  //     'prevNoteID': prevNoteID,
  //     'notes': notes,
  //     'notesIsFetching': notesIsFetching,
  //     'notesIsLoading': notesIsLoading,
  //     'selectedFolderID': selectedFolderID,
  //     'selectedNoteID': selectedNoteID,
  //   }
  // )

  useEffect(() => {
    /*
      This useEffect is setting the currentNote when there are notes to select from.
      The selectedFolderID and selectedNoteID have been set in the folder list.
    */
    if (isNewNote || notesIsLoading || notesIsFetching || !notes?.length || !selectedFolderID) return

    const firstNote = notes[0]
    const isSelectedIdInNotes = notes.some(note => note?.id === selectedNoteID)
   
    /*
      We've made it in here because the selectedNoteID and the currentNote.id don't match.
      Either id could be null as well. In addition, we aren't in the All Notes folder.
      If the currentNote is in the note list, then that is set.
      Otherwise, use the note from the lookup with the first note being the fallback
    */
    if (selectedNoteID !== currentNote?.id && selectedFolderID !== ALL_NOTES_ID) {
      console.log('[NOTES_INDEX] useEffect')
      console.log('  In any folder but All Notes: syncing note variables to currentNote, lookupNote, or firstNote')
      console.log('  [USE_EFFECT_SCOPE]', {
        'firstNote': firstNote,
        'isSelectedIdInNotes': isSelectedIdInNotes,
      })

      setCurrentNote(isCurrentIdInNotes ? currentNote : lookupNote ?? firstNote)
      setSelectedNoteID(isCurrentIdInNotes ? currentNote?.id : prevNoteID ?? firstNote?.id)
      setNoteByFolderID(selectedFolderID, (isCurrentIdInNotes ? currentNote?.id : prevNoteID ?? firstNote?.id))
      return
    }

    /*
      This prevents the view of the unsaved new note (from another folder) in the All Notes folder.
      Set note variables to previous note id from lookup
    */
    if (selectedFolderID === ALL_NOTES_ID && isLookupIdInList && !isSelectedIdInNotes && !(currentNote?.title || currentNote?.body)) {
      console.log('[NOTES_INDEX] useEffect')
      console.log('  In All Notes folder: syncing currentNote and selectedNoteID to note id from lookup')
      console.log('  [USE_EFFECT_SCOPE]', {
        'firstNote': firstNote,
        'isSelectedIdInNotes': isSelectedIdInNotes,
      })
      setCurrentNote(lookupNote)
      setSelectedNoteID(lookupNote?.id)
    }

    /*
      This Keeps the currentNote in sync with selectedNoteID if currentNote
      has been cleared after the original folder has been deleted.
      This prevents the NoteList's selected note's currentNote values from being empty.
    */
    if (selectedFolderID === ALL_NOTES_ID && !isCurrentIdInNotes) {
      console.log('[NOTES_INDEX] useEffect')
      console.log('  In All Notes folder: syncing currentNote and selectedNoteID to firstNote')
      console.log('  [USE_EFFECT_SCOPE]', {
        'firstNote': firstNote,
        'isSelectedIdInNotes': isSelectedIdInNotes,
      })
      setCurrentNote(firstNote)
      setSelectedNoteID(firstNote?.id)
      if (!isLookupIdInList) {
        setNoteByFolderID(selectedFolderID, selectedNoteID)
      }
    }
  }, [currentNote, isCurrentIdInNotes, isLookupIdInList, isNewNote, lookupNote, prevNoteID, notes, notesIsFetching, notesIsLoading, selectedFolderID, selectedNoteID, setCurrentNote, setNoteByFolderID, setSelectedNoteID])

  useEffect(() => {
    /*
      This useEffect is for resetting the currentNote to the selectedFolderID and selectedNoteID and setting isNewNote to true.
      If a folder's note list is empty and the user clicks a new folder, w/o making a new note, and then clicks back to the previous folder,
      Then we need to set the currentNote to the selected values informed by the lookup in FolderList.
    */
    if (notes?.length || notesIsLoading || notesIsFetching) return

    if (!notes?.length && !isCurrentIdInNotes) {
      console.log('[NOTES_INDEX] useEffect')
      console.log('  Back to new note')
      setCurrentNote({
        ...INITIAL_NOTE,
        folder: selectedFolderID,
        id: selectedNoteID
      })
      setIsNewNote(true)
    }
  }, [isCurrentIdInNotes, notes?.length, notesIsFetching, notesIsLoading, selectedFolderID, selectedNoteID, setCurrentNote, setIsNewNote])

  useEffect(() => {
    /*
      This useEffect is setting the currentNote, selectedNoteID, and noteByFolderID
      with the selectedFolderID and new crypto id when there is a new note. 
    */
    if (isNewNote && selectedFolderID && !currentNote?.id) {
      let id = (crypto?.randomUUID() || '').replaceAll('-', '')
      console.log('[NOTES_INDEX] useEffect')
      console.log('  New note with [selectedFolderID]', selectedFolderID, '[crypto id]', id)
      setCurrentNote({
        ...INITIAL_NOTE,
        folder: selectedFolderID,
        id: id
      })
      setSelectedNoteID(id)
      setNoteByFolderID(selectedFolderID, id)

      /*
        When creating a new note and if the All Notes folder id is present in the lookup
        but has no value, then add the new id from this new note
        Fixes issue of showing a blank note in the All Notes folder note list
      */
      const isAllNotesFolderPresent = Object.keys(noteByFolderID).includes(ALL_NOTES_ID)
      if (isAllNotesFolderPresent && !noteByFolderID[ALL_NOTES_ID]) {
        console.log("  Updating noteByFolderID lookup because the All Notes folder value is null")
        setNoteByFolderID(ALL_NOTES_ID, id)
      }
    }
  }, [currentNote?.id, isNewNote, noteByFolderID, selectedFolderID, setCurrentNote, setNoteByFolderID, setSelectedNoteID])

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
          key={currentNote?.id}
          initialValues={selectedFolderID && {...currentNote}}
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