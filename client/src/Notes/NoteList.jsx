import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormikContext } from 'formik'
import { PropTypes } from 'prop-types/prop-types'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DescriptionIcon from '@mui/icons-material/Description'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import useGetNotes from '@/hooks/useGetNotes'
import useDeleteNote from '@/hooks/useDeleteNote'
import ListHeader from '@/Notes/ListHeader'
import  { useScreenSize, useStore } from '@/store/store'
import EmptyState from '@/ui/EmptyState'

const NoteList = React.memo(() => {
  // Checkbox notes list state
  const [listState, setListState] = useState({
    isAllChecked: false,
    checkedIds: []
  })
  
  const { palette } = useTheme()
  const { values } = useFormikContext()
  const shouldFocusFirstNote = useRef(false)
  
  // Store
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const isNewNote = useStore(store => store.isNewNote)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)

  // Api query
  // Fetches notes by currently selected folder id from the store
  const { data: notes = [], isLoading: notesIsLoading } = useGetNotes()
  console.log("🚀 ~ index.jsx:42 ~ NoteList ~ notes:", notes)
  const screenSize = useScreenSize()
  const deleteNote = useDeleteNote()

  const isSelectedInNotes = useMemo(() => Boolean(notes?.length && notes?.some(note => note.id === selectedNoteID)), [notes, selectedNoteID])
  
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
    setSelectedNoteID(id)
    setIsNewNote(false)
  }, [selectedNoteID, setIsNewNote, setSelectedNoteID])

  const handleDeleteNote = useCallback(id => {
    deleteNote.mutate(id)
    // keep selected note unless we're deleting the selected one
    if (id == selectedNoteID) {
      setSelectedNoteID(null)
      shouldFocusFirstNote.current = true // Never sets to true
    }
  }, [deleteNote, selectedNoteID, setSelectedNoteID])

  useEffect(() => {
    // This side effect is for setting the selected note id and the is new note bool.
    console.log('2.Setting selectedNoteID and isNewNote in Note List side effect')
    // When notes have finished loading and there are none, then clean up selected note id and set is new not to true
    if (!notes?.length && !notesIsLoading) {
      console.log('  Setting selectedNoteID to: ', null, ' and isNewNote to: ', true)
      setSelectedNoteID(null)
      setIsNewNote(true)
      return
    }

    // When we have a new note, we have no notes, or notes is still loading, then bail out
    if (isNewNote || notesIsLoading || !notes?.length /* || (selectedNoteID && isSelectedInNotes) */) return

    // If we've deleted a note, then should focus first note should be true and we follow this logic.
    console.log("🚀 ~ file: index.jsx:104 ~ useEffect ~ shouldFocusFirstNote.current:", shouldFocusFirstNote.current)
    if (shouldFocusFirstNote.current) {
      console.log('shouldFocusFirstNote because we deleted')
      if (notes?.length) {
        console.log('1...')
        if (!isSelectedInNotes) {
          console.log('2...')
          if (!notesIsLoading) {
            console.log('3...')
            console.log('  Setting [selectedNoteID] to: ', notes[0]?.id)
            setSelectedNoteID(notes[0]?.id)
            setIsNewNote(false)
            shouldFocusFirstNote.current = false
          }
        }
      }
    
    }
  }, [isNewNote, isSelectedInNotes, notes, notesIsLoading, selectedNoteID, setIsNewNote, setSelectedNoteID, shouldFocusFirstNote])

  // useEffect(() => {
  //   if (notesIsLoading) return // Don't continue with side effect if loading is true
  //   const isSelectedInNotes = notes?.length && notes?.some(note => note.id === selectedNoteID)
  //   // Deleted all notes
  //   if (!notes?.length) {
  //     setSelectedNoteID(null)
  //     // Deleted the selectedNoteID
  //   } else if (notes.length && !isNewNote && (!selectedNoteID || !isSelectedInNotes)) {
  //     setSelectedNoteID(notes[0].id)
  //     // If we've added a new note w/o an id
  //     // Then set the selected note to the last (new) note in the list
  //   // } else if (Boolean(notesLength) && notes.length === notesLength + 1) {
  //   //   setSelectedNoteID(notes[notes.length -1]?.id)
  //   } else {
  //     // Default set user selected note
  //     setSelectedNoteID(selectedNoteID)
  //   }
  // }, [isNewNote, notes, notesIsLoading, selectedNoteID, setSelectedNoteID])

  return (
    <div
      style={{
        width: notesListWidth,
        paddingTop: '0.5rem',
        transition: 'all 1s ease-in-out',
      }}
    >
      <ListHeader listState={listState} setListState={setListState} />

      {notes?.length ? (
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
              sx={{
                width: 'calc(100% - 0.5rem)',
                height: '3rem',
                borderRadius: '0.5rem',
                paddingLeft: '1rem',
                marginLeft: '0.5rem',
                transition: 'all 1s ease-in-out',
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
                primary={values?.title}
                primaryTypographyProps={{ noWrap: true }}
                secondary={
                  <Typography
                    noWrap
                    variant='h5'
                    sx={{
                      color: palette.grey[600],
                    }}
                  >
                    {values?.body}
                  </Typography>
                }
              />
            </ListItem>
          ) : null} */}

          {notes?.map(({ id, title, body }) => {
            const labelId = `notes-list-label-${id}`;
            const isSelected = !isNewNote && id === selectedNoteID;

            return (
              <ListItem
                dense
                disablePadding
                key={labelId}
                sx={{
                  width: 'calc(100% - 0.5rem)',
                  borderRadius: '0.5rem',
                  paddingLeft: '1rem',
                  marginLeft: '0.5rem',
                  transition: 'all 1s ease-in-out',
                  backgroundColor: isSelected
                    ? palette.background.light
                    : 'inherit',
                }}
                secondaryAction={
                  <IconButton
                    disableRipple
                    onClick={() => handleDeleteNote(id)}
                    aria-label={`delete-note -${id}`}
                    edge='end'
                    sx={{
                      color: palette.grey[300],
                      '&:hover': { color: palette.primary[200] },
                    }}
                  >
                    <DeleteForeverIcon />
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
                    primary={isSelected ? values?.title : title}
                    primaryTypographyProps={{ noWrap: true }}
                    secondary={
                      <Typography
                        noWrap
                        variant='h5'
                        sx={{
                          color: palette.grey[600],
                        }}
                      >
                        {isSelected ? values?.body : body}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      ) : (
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
      )}
    </div>
  );
})

NoteList.displayName = '/NoteList'
NoteList.propTypes = {
  setIsNewNote: PropTypes.func,
}

export default NoteList
