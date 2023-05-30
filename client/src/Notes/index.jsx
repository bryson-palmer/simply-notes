import React, { useCallback, useState } from 'react'

import { Box, IconButton, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import { useTheme } from '@emotion/react'

import NoteForm from '@/Notes/NoteForm'
import NoteList from '@/Notes/NoteList'
import FlexBetween from '@/UI/FlexBetween'
import FlexColumn from '@/UI/FlexColumn'
import FolderList from '@/Folders/FolderList'


const Notes = React.memo(() => {
  const [isNewNote, setIsNewNote] = useState(false)

  const { palette } = useTheme()

  const handleIsNewNote = useCallback(() => {
    setIsNewNote(!isNewNote)
  }, [isNewNote])
 
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
              color: palette.secondary[400],
              "&:hover": { color: palette.secondary[100] },
            }}
            onClick={handleIsNewNote}
          >
            <AddIcon sx={{ fontSize: "1rem", marginRight: "-4px" }} />
            <CreateIcon />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      <Box sx={{ display: { xs: "none", sm: "flex" } }}>
        <FolderList></FolderList>
        <NoteList setIsNewNote={setIsNewNote} />
        <NoteForm isNewNote={isNewNote} setIsNewNote={setIsNewNote} />
      </Box>
    </FlexColumn>
  );
})

Notes.displayName = '/Notes'

export default Notes