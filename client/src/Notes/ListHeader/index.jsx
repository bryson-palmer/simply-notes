import { useCallback, useEffect } from 'react'

import { PropTypes } from 'prop-types/prop-types'

import { useTheme } from '@emotion/react'
import { Box, Checkbox, IconButton, ListItem, ListItemIcon } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import { useDeleteNote, useNotes } from '@/store/store-selectors'

const ListHeader = ({ listState, setListState }) => {
  const { palette } = useTheme()
  const deleteNote = useDeleteNote()
  const notes = useNotes()
  const { checkedIds, isAllChecked} = listState
  
  const handleAllNotesChecked = useCallback(() => setListState(prevListState => ({
    ...prevListState,
    isAllChecked: !prevListState.isAllChecked,
    checkedIds: prevListState.isAllChecked ? []: notes.map(({ id }) => id)
  })), [notes, setListState])
  
  const handleDeleteCheckedNotes = useCallback(() => {
    if (!Array.isArray(checkedIds) || checkedIds.length < 1) return
    deleteNote(checkedIds)

  }, [checkedIds, deleteNote])

  useEffect(() => {
    if (!notes.length) {  
      return setListState(prevListState => ({
        ...prevListState,
        isAllChecked: false,
        checkedIds: []
      }))
    }
  }, [isAllChecked, checkedIds.length, notes.length, setListState])

  return (
    <>
      {notes.length ? (
        <ListItem
          dense
          disablePadding
          sx={{
            paddingLeft: "1.5rem",
            borderBottom: `thin solid ${palette.grey[900]}`
          }}
          secondaryAction={
            checkedIds.length ? (
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
                checked={isAllChecked}
                inputProps={{ "aria-labelledby": "notes-list-header" }}
                sx={{
                  color: palette.grey[300],
                  "&:hover": { color: palette.primary[200] },
                }}
              />
            </ListItemIcon>
          </IconButton>
        </ListItem>
      ) : <Box minHeight='55px' width='206px' />}
    </>
  )
}

ListHeader.displayName = '/ListHeader'
ListHeader.propTypes = {
  listState: PropTypes.shape({
    isAllChecked: PropTypes.bool,
    checkedIds: PropTypes.arrayOf(PropTypes.string)}),
  setListState: PropTypes.func
}

export default ListHeader
