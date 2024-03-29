import { useCallback, useEffect, useRef } from 'react'

import { PropTypes } from 'prop-types/prop-types'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'

import { INITIAL_NOTE } from '@/constants/constants'
import { useSelectedFolderID, useStore } from '@/store/store'
import useDeleteNote from '@/hooks/useDeleteNote'
import useGetNotes from '@/hooks/useGetNotes'

const ListHeader = ({ listState, setListState }) => {
  const { palette } = useTheme()

  const { setCurrentNote, setIsNewNote, setNoteByFolderID, setSelectedNoteID } = useStore()

  const deleteNote = useDeleteNote()
  const { data: notes = [] } = useGetNotes()
  const selectedFolderID = useSelectedFolderID()
  const { checkedIds, isAllChecked} = listState
  const folderIdRef = useRef(notes[0]?.folder)
  
  const handleAllNotesChecked = useCallback(() => setListState(prevListState => ({
    ...prevListState,
    isAllChecked: !prevListState.isAllChecked,
    checkedIds: prevListState.isAllChecked ? []: notes?.map(({ id }) => id)
  })), [notes, setListState])
  
  const handleDeleteCheckedNotes = useCallback(() => {
    if (!Array.isArray(checkedIds) || checkedIds.length < 1) return
    deleteNote.mutate({ folder: folderIdRef.current, id: checkedIds})
    setSelectedNoteID(null)
    setCurrentNote(INITIAL_NOTE)
    setNoteByFolderID(selectedFolderID, null)
    setIsNewNote(true)

  }, [checkedIds, deleteNote, selectedFolderID, setCurrentNote, setIsNewNote, setNoteByFolderID, setSelectedNoteID])

  useEffect(() => {
    if (!notes?.length) {  
      return setListState(prevListState => ({
        ...prevListState,
        isAllChecked: false,
        checkedIds: []
      }))
    }
  }, [isAllChecked, checkedIds.length, notes?.length, setListState])

  return (
    <>
      {notes?.length ? (
        <ListItem
          dense
          disablePadding
          sx={{ paddingLeft: "1.5rem" }}
          secondaryAction={
            checkedIds.length ? (
              <IconButton
                disableRipple
                onClick={handleDeleteCheckedNotes}
                aria-label="delete-all-notes"
                sx={{
                  color: palette.grey[300],
                  marginRight: '-3px',
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
      ) : (
        <Box
          minHeight='49px'
          width='206px'
        />
      )}
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
