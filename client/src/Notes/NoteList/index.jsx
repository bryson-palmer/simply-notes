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
  const selectedFolderID = useStore(store => store.selectedFolderID)

  // From react query
  const { data: notes = [], isLoading: notesIsLoading } = useNotes(!!selectedFolderID && selectedFolderID)
  console.log("🚀 ~ file: index.jsx:39 ~ NoteList ~ notes:", notes)
  const screenSize = useScreenSize()
  const deleteNote = useDeleteNote()
  
  // From zustand store
  const selectedNote = useStore(store => store.selectedNote)
  console.log("🚀 ~ file: index.jsx:41 ~ NoteList ~ selectedFolderID:", selectedFolderID)
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const setSelectedNote = useStore(store => store.setSelectedNote)

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

  const handleSelectNote = useCallback(value => () => {
    setIsNewNote(false)
    setSelectedNote(value)
  }, [setIsNewNote, setSelectedNote])

  const handleDeleteNote = useCallback(id => {
    deleteNote.mutate(id)
  }, [deleteNote])

  // anytime a folder is selected, fetch all notes for that folder
  // useEffect(() => {
  //   if (selectedFolderID) {
  //     getAllNotes(selectedFolderID)
  //   }
  // }, [getAllNotes, selectedFolderID])

  useEffect(() => {
    if (notesIsLoading) return // Don't continue with side effect if loading is true
    const isSelectedInNotes = notes?.length && notes?.some(note => note.id === selectedNote.id)
    // Deleted all notes
    if (!notes?.length && selectedNote?.id) {
      setSelectedNote({})
      // Deleted the selectedNote
    } else if (notes.length && (!selectedNote?.id || !isSelectedInNotes)) {
      setSelectedNote(notes[0])
      // Default set user selected note
    } else {
      setSelectedNote(selectedNote)
    }
  }, [notes, notesIsLoading, selectedNote, setSelectedNote]) // anytime these three variables change, trigger this useEffect

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
                    id === selectedNote.id
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
                    // take selectedNote as source of truth for title and body, because on update we do not update selectedNote
                    primary={
                      selectedNote.title && id === selectedNote.id
                        ? selectedNote.title
                        : title
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
                        {selectedNote.body && id === selectedNote.id
                          ? selectedNote.body
                          : body}
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
