import React from 'react'

import { useTheme } from '@mui/material'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { PropTypes } from 'prop-types/prop-types'

import useGetNote from '@/hooks/useGetNote'
import  { useStore } from '@/store/store'
import './styles.css'

const NoteListItemText = React.memo(({id}) => {
  
  const { palette } = useTheme()

  // Store
  const isNewNote = useStore(store => store.isNewNote)
  const currentNote = useStore(store => store.currentNote)
  const selectedNoteID = useStore(store => store.selectedNoteID)

  // Api
  const { data: note = {}, /* isFetching: noteIsFetching, isLoading: noteIsLoading */} = useGetNote(id)
  

  const labelId = `note-${id}`;
  const isSelected = !isNewNote && id === selectedNoteID
  console.log('NoteListItemText====', note, id)
  return (
    <ListItemText
      id={labelId}
      sx={{
        color: palette.secondary[400],
      }}
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
