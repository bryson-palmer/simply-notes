import React, { useCallback, useEffect, useMemo, useState } from 'react'

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

import { INITIAL_NOTE } from '@/constants/constants'
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
  
  // Store
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const isNewNote = useStore(store => store.isNewNote)
  // const currentNote = useStore(store => store.currentNote)
  const setCurrentNote = useStore(store => store.setCurrentNote)
  const selectedFolderID = useStore(store => store.selectedFolderID)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  console.log("🚀 [selectedNoteID]:", selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  const setNoteByFolderID = useStore(store => store.setNoteByFolderID)

  // Api query
  const { data: notes = [], isLoading: notesIsLoading } = useGetNotes()
  const screenSize = useScreenSize()
  const deleteNote = useDeleteNote()

  // const isSelectedInNotes = useMemo(() => Boolean(notes?.length && notes?.some(note => note.id === selectedNoteID)), [notes, selectedNoteID])
  
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
    setNoteByFolderID(selectedFolderID, id)
    setSelectedNoteID(id)
    setCurrentNote(notes.find(note => note.id === id))
    setIsNewNote(false)
  }, [notes, selectedFolderID, selectedNoteID, setCurrentNote, setIsNewNote, setNoteByFolderID, setSelectedNoteID])

  const handleDeleteNote = useCallback(id => {
    let list_is_empty = (notes?.length <= 1)
    let notes_copy = [...notes]
    // list_is_empty if the deleted note will make the notes list empty
    deleteNote.mutate(id)
    // keep selected note unless we're deleting the selected one
    if (id === selectedNoteID) {
      if (list_is_empty) {
        // that was our last note. Display a new-note
        setSelectedNoteID(null)
        setCurrentNote(INITIAL_NOTE)
        setIsNewNote(true)
      } else {
        // need to focus another note. Find the note below the one we were deleting. Or above if none below
        let deleting_index = notes_copy.findIndex(obj => obj.id === id)
        let new_index = 0
        if (deleting_index !== -1) {
          // we know where the old note was, set new note to be note below our deleted note
          new_index = deleting_index + 1
          if (notes_copy.length <= new_index) {
            new_index = deleting_index - 1
          }
          new_index = Math.max(0, new_index)  // make sure we don't have a negative index
        }
        let note_to_focus = notes_copy[new_index]
        setSelectedNoteID(note_to_focus?.id)
        setCurrentNote(note_to_focus)
      }
    }
  }, [deleteNote, notes, selectedNoteID, setCurrentNote, setIsNewNote, setSelectedNoteID])

  useEffect(() => {
    // This side effect is for syncing the selectedNoteID and currentNote.
    if (isNewNote || notesIsLoading) return

    console.log('NoteList useEffect')
    if (!notes?.length) {
      console.log('  No notes')
      console.log('  Setting isNewNote to: ', true)
      setIsNewNote(true)
    }
  }, [isNewNote, notes?.length, notesIsLoading, setIsNewNote])

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
                    primary={title}
                    primaryTypographyProps={{ noWrap: true }}
                    secondary={
                      <Typography
                        noWrap
                        variant='h5'
                        sx={{
                          color: palette.grey[600],
                        }}
                      >
                        {body}
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

export default NoteList
