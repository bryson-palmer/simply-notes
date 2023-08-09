import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PropTypes } from 'prop-types/prop-types'

import { useTheme } from '@emotion/react'
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import { DeleteForever as DeleteForeverIcon, Description as DescriptionIcon } from '@mui/icons-material'

import useNotes from '@/hooks/useNotes'
import useDeleteNote from '@/hooks/useDeleteNote'
import ListHeader from '@/Notes/ListHeader'
import  { useScreenSize, useStore } from '@/store/store'
import EmptyState from '@/UI/EmptyState'

const NoteList = React.memo(() => {
  const [listState, setListState] = useState({
    isAllChecked: false,
    checkedIds: []
  })
  
  const { palette } = useTheme()
  
  // From react query
  const { data: notes = [], isLoading: notesIsLoading } = useNotes()
  console.log("🚀 ~ file: index.jsx:39 ~ NoteList ~ notes:", notes)
  const [notesLength, setNotesLength] = useState(notes?.length)
  const screenSize = useScreenSize()
  const deleteNote = useDeleteNote()
  
  // From zustand store
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const selectedNoteID = useStore(store => store.selectedNoteID)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  
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
  }, [deleteNote])

  useEffect(() => {
    if (notes.length) {
      setNotesLength(notes.length)
    }
  }, [notes])

  useEffect(() => {
    if (notesIsLoading) return // Don't continue with side effect if loading is true
    const isSelectedInNotes = notes?.length && notes?.some(note => note.id === selectedNoteID)
    // Deleted all notes
    if (!notes?.length) {
      setSelectedNoteID(null)
      // Deleted the selectedNoteID
    } else if (notes.length && (!selectedNoteID || !isSelectedInNotes)) {
      setSelectedNoteID(notes[0].id)
      // If we've added a new note w/o an id
      // Then set the selected note to the last (new) note in the list
    } else if (Boolean(notesLength) && notes.length === notesLength + 1) {
      setSelectedNoteID(notes[notes.length -1]?.id)
    } else {
      // Default set user selected note
      setSelectedNoteID(selectedNoteID)
    }
  }, [notes, notesIsLoading, notesLength, selectedNoteID, setSelectedNoteID])

  return (
    <div
      style={{
        width: notesListWidth,
        paddingTop: '0.5rem',
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
            borderTopRightRadius: isDesktop ? '0.5rem' : 0
          }}
        >
          {notes?.map(({ id, title, body }) => {
            const labelId = `notes-list-label-${id}`

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
                  backgroundColor:
                    id === selectedNoteID
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
                      '&.MuiListItemIcon-root': { minWidth: 'auto' }
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
                    padding: '0 38px 0 0 !important',
                    '&:hover': { backgroundColor: 'transparent' }
                  }}
                >
                  <ListItemText
                    id={labelId}
                    sx={{
                      color: palette.secondary[400],
                    }}
                    // TODO: take selectedNoteID as source of truth for title and body, because on update we do not update selectedNoteID
                    primary={
                        title
                    }
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
            )
          })}
        </List>
      ) : (
        <Box
          sx={{
            height: '88vh',
            paddingTop: '0.5rem',
            borderTop: `thin solid ${palette.grey[800]}`,
            borderRight: isDesktop ? `thin solid ${palette.grey[800]}` : 0,
            borderTopRightRadius: isDesktop ? '0.5rem' : 0
          }}
        >
          <EmptyState EmptyIcon={Icon} text='No notes' />
        </Box>
      )}
    </div>
  )
})

NoteList.displayName = '/NoteList'
NoteList.propTypes = {
  setIsNewNote: PropTypes.func,
}

export default NoteList
