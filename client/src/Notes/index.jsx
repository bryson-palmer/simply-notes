import React, { useCallback, useContext, useState } from 'react'

import { PropTypes } from 'prop-types/prop-types'

import { Box, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import { useTheme } from '@emotion/react'

import { StoreContext } from '@/Providers/store.provider'
import NoteForm from '@/Notes/NoteForm'
import NoteList from '@/Notes/NoteList'
import NoteView from '@/Notes/NoteView'
import FlexBetween from '@/UI/FlexBetween'
import FlexColumn from '@/UI/FlexColumn'

const NotesComponent = ({ notes, removeNote }) => {
  const [addNote, setAddNote] = useState(false)
  const [selectedNote, setSelectedNote] = useState(notes[0])

  const { palette } = useTheme()

  const handleAddNote = useCallback(() => {
    setAddNote(!addNote)
  }, [addNote])
 
  return (
    <FlexColumn>
      <FlexBetween>
        <Typography
          variant="h3"
          color={palette.secondary[400]}
          padding="2rem 0"
        >
          Well, hello there. What would you like to do?
        </Typography>
        <FlexBetween>
          <IconButton
            sx={{
              color: palette.secondary[200],
              "&:hover": { color: palette.secondary[400] },
            }}
            onClick={handleAddNote}
          >
            <AddIcon sx={{ fontSize: "1rem", marginRight: "-4px" }} />
            <CreateIcon />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      <Box sx={{ display: { xs: "none", sm: "flex" } }}>
        <NoteList
          notes={notes}
          removeNote={removeNote}
          setAddNote={setAddNote}
          setSelectedNote={setSelectedNote}
        />
        {addNote ? (
          <NoteForm
            notes={notes}
            setAddNote={setAddNote}
            setSelectedNote={setSelectedNote}
          />
        ) : (
          <NoteView selectedNote={selectedNote} />
        )}
      </Box>
    </FlexColumn>
  );
}

NotesComponent.displayName = '/Notes'
NotesComponent.propTypes = {
  removeNote: PropTypes.func,
  notes: PropTypes.arrayOf(PropTypes.shape({
    note: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      body: PropTypes.string
    })
  }))
}

const Notes = React.memo(() => {
  const { removeNote, store: { notes } } = useContext(StoreContext)

  return (
    <NotesComponent notes={notes} removeNote={removeNote} />
  )
})

export default Notes