import { useCallback, useEffect, useState } from 'react'

import { PropTypes } from 'prop-types/prop-types'

import { useTheme } from '@emotion/react'
import { Checkbox, IconButton, ListItem, ListItemIcon } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { /* useDeleteAll, */ useDeleteNote, useNotes } from '@/store/store-selectors'

const ListHeader = ({ checked, setChecked }) => {
  const [allChecked, setAllChecked] = useState(false)
  
  const { palette } = useTheme()
  // const deleteAll = useDeleteAll()
  const deleteNote = useDeleteNote()
  const notes = useNotes()
  
  const handleAllNotesChecked = useCallback(() => setAllChecked(!allChecked), [allChecked])
  
  const handleDeleteCheckedNotes = useCallback(() => {
    if (!Array.isArray(checked) || checked.length < 1) return
    checked.map(id => deleteNote(id))

    // allChecked
    //   ? deleteAll()
    //   : checked.map(id => deleteNote(id))
  }, [checked, deleteNote])

  useEffect(() => {
    const newChecked = allChecked
      ? notes.map(({ id }) => id)
      : []
    setChecked(newChecked)
  }, [allChecked, notes, setChecked])

  useEffect(() => {
    if (!notes.length) return setAllChecked(false)
  }, [notes.length])

  return (
    <ListItem
      dense
      disablePadding
      sx={{
        borderRadius: "1rem",
        paddingLeft: "1rem",
      }}
      secondaryAction={
        checked.length ? (
          <IconButton
            disableRipple
            onClick={handleDeleteCheckedNotes}
            aria-label="delete-all-notes"
            edge="end"
            sx={{
              color: palette.grey[300],
              "&:hover": { color: palette.primary[200] },
            }}
          >
            <DeleteForeverIcon />
          </IconButton>
        ) : null
      }
    >
      <IconButton disableRipple size="small" onClick={handleAllNotesChecked}>
        <ListItemIcon sx={{ "&.MuiListItemIcon-root": { minWidth: "auto" } }}>
          <Checkbox
            disableRipple
            edge="start"
            checked={allChecked}
            // tabIndex={-1}
            inputProps={{ "aria-labelledby": "notes-list-header" }}
            sx={{
              color: palette.grey[300],
              "&:hover": { color: palette.primary[200] },
            }}
          />
        </ListItemIcon>
      </IconButton>
    </ListItem>
  );
}

ListHeader.displayName = '/ListHeader'
ListHeader.propTypes = {
  checked: PropTypes.arrayOf(PropTypes.number),
  setChecked: PropTypes.func
}

export default ListHeader
