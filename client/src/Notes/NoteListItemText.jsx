import React from 'react'

import { useTheme } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { PropTypes } from 'prop-types/prop-types'

import useGetNote from '@/hooks/useGetNote'
import  { useCurrentNote, useIsNewNote, useSelectedNoteID } from '@/store/store'

const NoteListItemText = React.memo(({id}) => {
  
  const { palette } = useTheme()

  // Store
  const currentNote = useCurrentNote()
  const isNewNote = useIsNewNote()
  const selectedNoteID = useSelectedNoteID()

  // Api
  const { data: note = {} } = useGetNote(id)
  
  const labelId = `note-${id}-text`
  const isSelected = !isNewNote && id === selectedNoteID

  return (
    <ListItemText
      id={labelId}
      sx={{ color: palette.secondary[400] }}
      primary={isSelected ? currentNote?.title : note?.title}
      primaryTypographyProps={{ noWrap: true }}
      secondary={
        <Typography
          noWrap
          variant='h5'
          sx={{
            color: palette.grey[600],
          }}
        >
          {isSelected ? currentNote?.body : note?.body}
        </Typography>
      }
    />
  )
})

NoteListItemText.displayName = '/NoteListItemText'
NoteListItemText.propTypes = {
  id: PropTypes.string,
}
export default NoteListItemText
