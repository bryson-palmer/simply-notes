import React, { useCallback, useState } from 'react'
import { PropTypes } from 'prop-types/prop-types'

import { useTheme } from '@emotion/react'
import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import ListHeader from '@/Notes/ListHeader'
import { useDeleteNote, useGetNote, useNotes } from '@/store/store-selectors'

const NoteList = React.memo(({ setAddNote }) => {
  const [checked, setChecked] = useState([])

  const { palette } = useTheme()
  const notes = useNotes()
  const getNote = useGetNote()
  const deleteNote = useDeleteNote()
  console.log('🚀 ~ file: index.jsx:27 ~ notes:', notes)
  
  const handleCheckToggle = useCallback(value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    currentIndex === -1
      ? newChecked.push(value)
      : newChecked.splice(currentIndex, 1)

    setChecked(newChecked)
  }, [checked])

  const handleSelectNote = useCallback(value => () => {
    setAddNote(false)
    getNote(value)
  }, [getNote, setAddNote])

  const handleDeleteNote = useCallback(id => {
    deleteNote(id)
  }, [deleteNote])

  return (
    <div
      style={{
        width: '30%',
        minWidth: 200,
        height: '75vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingTop: 0,
        paddingRight: '1rem',
        bgcolor: 'transparent',
        borderRight: `1px solid ${palette.grey[800]}`,
      }}
    >
      <ListHeader checked={checked} setChecked={setChecked} />
      <List>
        {notes.map(({ id, title, body }) => {
          const labelId = `notes-list-label-${id}`

          return (
            <ListItem
              dense
              disablePadding
              key={labelId}
              sx={{
                borderRadius: '1rem',
                paddingLeft: '1rem',
                '&:hover': { backgroundColor: palette.background.light },
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
                  sx={{ '&.MuiListItemIcon-root': { minWidth: 'auto' } }}
                >
                  <Checkbox
                    disableRipple
                    edge='start'
                    checked={checked.includes(id)}
                    tabIndex={-1}
                    inputProps={{ 'aria-labelledby': labelId }}
                    sx={{
                      color: palette.grey[300],
                      '&:hover': { color: palette.primary[200] },
                    }}
                  />
                </ListItemIcon>
              </IconButton>
              <ListItemButton
                role={undefined}
                onClick={handleSelectNote(id)}
                sx={{ '&:hover': { backgroundColor: 'transparent' } }}
              >
                <ListItemText
                  id={labelId}
                  sx={{
                    color: palette.grey[200],
                    '&:hover': { color: palette.primary[200] },
                  }}
                  primary={title}
                  primaryTypographyProps={{ noWrap: true }}
                  secondary={
                    <Typography
                      noWrap
                      variant='h5'
                      sx={{
                        color: palette.grey[600],
                        display: { sm: 'none', md: 'block' },
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
    </div>
  )
})

NoteList.displayName = '/NoteList'
NoteList.propTypes = {
  setAddNote: PropTypes.func,
}

export default NoteList
