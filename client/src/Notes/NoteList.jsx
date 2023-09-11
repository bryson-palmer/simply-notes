import React, { useCallback, useEffect, useMemo, useState } from 'react'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DescriptionIcon from '@mui/icons-material/Description'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { INITIAL_NOTE } from '@/constants/constants'
import useGetNotes from '@/hooks/useGetNotes'
import useDeleteNote from '@/hooks/useDeleteNote'
import ListHeader from '@/Notes/ListHeader'
import  { useScreenSize, useStore } from '@/store/store'
import EmptyState from '@/ui/EmptyState'
import './styles.css'

const NoteList = React.memo(() => {
  // Checkbox state for note list
  const [listState, setListState] = useState({
    isAllChecked: false,
    checkedIds: []
  })
  
  const { palette } = useTheme()
  
  // Store
  const screenSize = useScreenSize()
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const isNewNote = useStore(store => store.isNewNote)
  const newNoteID = useStore(store => store.newNoteID)
  const setNewNoteID = useStore(store => store.setNewNoteID)
  const currentNote = useStore(store => store.currentNote)
  const setCurrentNote = useStore(store => store.setCurrentNote)
  const selectedFolderID = useStore(store => store.selectedFolderID)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  const setNoteByFolderID = useStore(store => store.setNoteByFolderID)
  const noteByFolderID = useStore(store => store.noteByFolderID)

  // Api
  const { data: notes = [], isFetching: notesIsFetching, isLoading: notesIsLoading } = useGetNotes()
  const deleteNote = useDeleteNote()
  
  const hasViewTransition = Boolean(document.startViewTransition)
  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const notesListWidth = useMemo(() => {
    if (screenSize === 'large') return 350
    if (screenSize === 'tablet') return 300
    if (screenSize === 'desktop' || screenSize === 'mobile') return 224
  }, [screenSize])
  
  const Icon = () => <DescriptionIcon />
  
  const handleCheckToggle = useCallback(value => () => {
    const currentIndex = listState.checkedIds.indexOf(value)
    const newCheckedIds = [...listState.checkedIds]

    currentIndex === -1
      ? newCheckedIds.push(value)
      : newCheckedIds.splice(currentIndex, 1)
      
      setListState(prevListState => {
        const isNewAllChecked = !prevListState.isAllChecked && newCheckedIds.length === notes?.length
        return ({
      ...prevListState,
      checkedIds: newCheckedIds,
      isAllChecked: isNewAllChecked
    })
  })
  }, [listState.checkedIds, notes?.length])

  const handleSelectNote = useCallback(id => () => {
    if (id === selectedNoteID) return
    console.log('[NOTE_CLICK]', id)
    console.log('  Updating all note variables (noteByFolderID, selectedNoteID, currentNote, isNewNote)')
    setNoteByFolderID(selectedFolderID, id)
    setSelectedNoteID(id)
    setCurrentNote(notes.find(note => note.id === id))
    setIsNewNote(false)
  }, [notes, selectedFolderID, selectedNoteID, setCurrentNote, setIsNewNote, setNoteByFolderID, setSelectedNoteID])

  const handleDeleteNote = useCallback(id => {
    console.log('[NOTE_DELETE]')
    // listIsEmpty if the deleted note will make the notes list empty
    const listIsEmpty = (notes?.length <= 1)
    const notesCopy = [...notes]

    deleteNote.mutate(id)

    // If deleting the selectedNoteID
    if (id === selectedNoteID) {
      console.log('  Deleting the selectedNoteID')
      console.log('  [listIsEmpty]:', listIsEmpty)

      if (listIsEmpty) {
        /*
          That was the last note in the list
          Need to reset note variables to initial or null.
          Should set the noteByFolderID lookup to null because that note doesn't exist
        */
        setSelectedNoteID(null)
        setCurrentNote(INITIAL_NOTE)
        setNoteByFolderID(selectedFolderID, null)
        setIsNewNote(true)
      } else {
        /*
          Determining a new selected note if there are still notes.
          Find the note next in the list or previous if the deleted note was the last in the list
        */
        let deletingIndex = notesCopy.findIndex(obj => obj.id === id)
        let newIndex = 0

        if (deletingIndex !== -1) {
          // we know where the old note was, set new note to be the next note in the list
          newIndex = deletingIndex + 1
          console.log('  Setting the next note in the list')

          if (notesCopy.length <= newIndex) {
            console.log('  Setting the previous note in the list')
            newIndex = deletingIndex - 1
          }
          newIndex = Math.max(0, newIndex)
        }

        /*
          Updating note variables.
          Should update the noteByFolderID look up because selectedNoteID and currentNote are getting updated
        */
        let noteToFocus = notesCopy[newIndex]
        setSelectedNoteID(noteToFocus?.id)
        setCurrentNote(noteToFocus)
        setNoteByFolderID(selectedFolderID, noteToFocus?.id)

        /*
          Looking for any other folder with the same [folderID, noteID] and removing it from the lookup.
          Another folder in the lookup is still set to the id we are going to delete.
          Remove the note id from that folder as well
        */
        const otherFolderWithDeletingID = Object.entries(noteByFolderID).find(entry => entry[0] !== selectedFolderID && entry[1] === id)
        if (otherFolderWithDeletingID !== undefined) {
          setNoteByFolderID(otherFolderWithDeletingID[0], null)
        }
      }
    }
  }, [deleteNote, noteByFolderID, notes, selectedFolderID, selectedNoteID, setCurrentNote, setIsNewNote, setNoteByFolderID, setSelectedNoteID])

  useEffect(() => {
    /*
      This side effect is for handling the animation for a new note being added to the list.
    */
   if (hasViewTransition && newNoteID && newNoteID === notes[0]?.id) {
      const listItemEl = document.querySelector(`#note-${newNoteID}`)
      const transition = document.startViewTransition(() => {
        listItemEl.classList.add('incoming')
        listItemEl.style.viewTransitionName = `#note-${newNoteID}`
      })

      transition.updateCallbackDone.then(() => {
          setNewNoteID(null)
      })
    }
  }, [hasViewTransition, newNoteID, notes, setNewNoteID])

  return (
    <div
      style={{
        width: notesListWidth,
        paddingTop: '0.5rem',
        transition: 'all 1s ease-in-out',
      }}
    >
      <ListHeader listState={listState} setListState={setListState} />

      {notes?.length && !notesIsLoading && !notesIsFetching ? (
        <List
          sx={{
            height: '88vh',
            overflow: 'auto',
            paddingRight: '0.5rem',
            borderTop: `thin solid ${palette.grey[800]}`,
            borderRight: isDesktop ? `thin solid ${palette.grey[800]}` : 0,
            borderTopRightRadius: isDesktop ? '0.5rem' : 0,
          }}
        >
          {/* A new note's place in the list */}
          {/* {isNewNote ? (
            <ListItem
              dense
              disablePadding
              id='new-note'
              key={`note-${currentNote?.id}`}
              sx={{
                width: 'calc(100% - 0.5rem)',
                height: '3rem',
                borderRadius: '0.5rem',
                paddingLeft: '1rem',
                marginLeft: '0.5rem',
                backgroundColor: palette.background.light,
              }}
              secondaryAction={
                <IconButton
                  disableRipple
                  disabled={true}
                  onClick={() => 'noop'}
                  aria-label='delete-note-disabled'
                  edge='end'
                  sx={{
                    color: palette.grey[300],
                    '&.Mui-disabled': { color: palette.grey[400], opacity: 0.5},
                  }}
                >
                  <DeleteForeverIcon />
                </IconButton>
              }
            >
              <IconButton
                disableRipple
                size='small'
                onClick={() => 'noop'}
              >
                <ListItemIcon
                  sx={{
                    '&.MuiListItemIcon-root': { minWidth: 'auto' },
                  }}
                >
                  <Checkbox
                    disableRipple
                    disabled={true}
                    edge='start'
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': 'new-note' }}
                    sx={{
                      color: palette.grey[300],
                      padding: '9px 3px 9px 9px',
                      '&.Mui-disabled': { color: palette.grey[400], opacity: 0.5},
                    }}
                  />
                </ListItemIcon>
              </IconButton>
              <ListItemText
                id='new-note'
                sx={{
                  color: palette.secondary[400],
                }}
                primary={currentNote?.title}
                primaryTypographyProps={{ noWrap: true }}
                secondary={
                  <Typography
                    noWrap
                    variant='h5'
                    sx={{
                      color: palette.grey[600],
                    }}
                  >
                    {currentNote?.body}
                  </Typography>
                }
              />
            </ListItem>
          ) : null} */}

          {notes?.map(({ id, title, body }, index) => {
            const labelId = `note-${id}`;
            const isSelected = !isNewNote && id === selectedNoteID

            return (
              <ListItem
                dense
                disablePadding
                id={labelId}
                key={labelId}
                style={{ viewTransitionName: labelId }}
                sx={{
                  width: 'calc(100% - 0.5rem)',
                  borderRadius: '0.5rem',
                  paddingLeft: '1rem',
                  marginLeft: '0.5rem',
                  visibility: hasViewTransition && newNoteID === id
                    ? 'hidden'
                    : 'visible',
                  backgroundColor: isSelected
                    ? palette.background.light
                    : 'inherit',
                }}
                secondaryAction={
                  <IconButton
                    disableRipple
                    onClick={() => handleDeleteNote(id)}
                    aria-label={`delete-note-${id}`}
                    id={`delete-note-${id}`}
                    edge='end'
                    sx={{
                      color: palette.grey[300],
                      '&:hover': { color: palette.primary[200] },
                    }}
                  >
                    <DeleteForeverIcon id={`delete-note-${index}`} />
                  </IconButton>
                }
              >
                <IconButton
                  disableRipple
                  size='small'
                  onClick={handleCheckToggle(id)}
                >
                  <ListItemIcon
                    sx={{
                      '&.MuiListItemIcon-root': { minWidth: 'auto' },
                    }}
                  >
                    <Checkbox
                      disableRipple
                      edge='start'
                      checked={listState.checkedIds.includes(id)}
                      tabIndex={-1}
                      inputProps={{ 'aria-labelledby': labelId }}
                      sx={{
                        color: palette.grey[300],
                        padding: '9px 3px 9px 9px',
                        '&:hover': { color: palette.primary[200] },
                      }}
                    />
                  </ListItemIcon>
                </IconButton>
                <ListItemButton
                  disableRipple
                  role={undefined}
                  onClick={handleSelectNote(id)}
                  sx={{
                    transition: 'all 1s ease-in-out',
                    padding: '0 38px 0 0 !important',
                    '&:hover': { backgroundColor: 'transparent' },
                  }}
                >
                  <ListItemText
                    id={labelId}
                    sx={{
                      color: palette.secondary[400],
                    }}
                    primary={isSelected ? currentNote?.title : title}
                    primaryTypographyProps={{ noWrap: true }}
                    secondary={
                      <Typography
                        noWrap
                        variant='h5'
                        sx={{
                          color: palette.grey[600],
                        }}
                      >
                        {isSelected ? currentNote?.body : body}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : null}

      {!notes?.length && !notesIsLoading && !notesIsFetching ? (
        <Box
          sx={{
            height: '88vh',
            paddingTop: '0.5rem',
            borderTop: `thin solid ${palette.grey[800]}`,
            borderRight: isDesktop ? `thin solid ${palette.grey[800]}` : 0,
            borderTopRightRadius: isDesktop ? '0.5rem' : 0,
          }}
        >
          <EmptyState EmptyIcon={Icon} text='No notes' />
        </Box>
      ) : null}

      {notesIsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: palette.secondary[400] }} />
      </Box>
      ) : null}
    </div>
  );
})

NoteList.displayName = '/NoteList'

export default NoteList
