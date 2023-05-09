import { useCallback, useState } from 'react'
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
import DeleteIcon from '@mui/icons-material/Delete'

const NoteList = ({
  notes, 
  removeNote,
  setAddNote,
  setSelectedNote
}) => {
  const [checked, setChecked] = useState([])
  const { palette } = useTheme()
  
  const handleCheckToggle = useCallback(value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    currentIndex === -1
      ? newChecked.push(value)
      : newChecked.splice(currentIndex, 1)

    setChecked(newChecked)
  }, [checked])

  const handleSelectNote = useCallback(value => () => {
    const selectedNote = notes.find(note => note.id === value)

    setAddNote(false)
    setSelectedNote(selectedNote)
  }, [notes, setAddNote, setSelectedNote])

  const handleDeleteNote = useCallback(() => {
    if (!Array.isArray(checked) || checked.length < 1) return
    removeNote(checked)
  }, [checked, removeNote])

  return (
    <List
      sx={{
        width: "30%",
        minWidth: 200,
        height: "80vh",
        paddingTop: 0,
        paddingRight: "1rem",
        bgcolor: "transparent",
        borderRight: `1px solid ${palette.grey[800]}`,
      }}
    >
      {notes.map(({ id, title, body }) => {
        const labelId = `notes-list-label-${id}`

        return (
          <ListItem
            dense
            disablePadding
            key={labelId}
            sx={{
              borderRadius: "1rem",
              paddingLeft: "1rem",
              "&:hover": { backgroundColor: palette.background.light },
            }}
            secondaryAction={
              <IconButton
                disableRipple
                onClick={handleDeleteNote}
                aria-label="comments"
                edge="end"
                sx={{
                  color: palette.grey[300],
                  "&:hover": { color: palette.primary[200] },
                }}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <IconButton
              disableRipple
              size="small"
              onClick={handleCheckToggle(id)}
            >
              <ListItemIcon
                sx={{ "&.MuiListItemIcon-root": { minWidth: "auto" } }}
              >
                <Checkbox
                  disableRipple
                  edge="start"
                  checked={checked.includes(id)}
                  tabIndex={-1}
                  inputProps={{ "aria-labelledby": labelId }}
                  sx={{
                    color: palette.grey[300],
                    "&:hover": { color: palette.primary[200] },
                  }}
                />
              </ListItemIcon>
            </IconButton>
            <ListItemButton
              role={undefined}
              onClick={handleSelectNote(id)}
              sx={{ "&:hover": { backgroundColor: "transparent" } }}
            >
              <ListItemText
                id={labelId}
                sx={{
                  color: palette.grey[200],
                  "&:hover": { color: palette.primary[200] },
                }}
                primary={title}
                primaryTypographyProps={{ noWrap: true }}
                secondary={
                  <Typography
                    noWrap
                    variant="h5"
                    sx={{
                      color: palette.grey[600],
                      display: { sm: "none", md: "block" },
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
  )
}

NoteList.displayName = '/NoteList'
NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.shape({
    note: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string
    })
  })),
  removeNote: PropTypes.func,
  setAddNote: PropTypes.func,
  setSelectedNote: PropTypes.func
}

export default NoteList
