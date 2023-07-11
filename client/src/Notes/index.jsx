import React, { useCallback, useState } from 'react'

import { Box, IconButton, Typography, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import FolderIcon from '@mui/icons-material/Folder'
import { useTheme } from '@emotion/react'

import Drawer from '@/Drawer'
import FolderList from '@/Folders/FolderList'
import NoteForm from '@/Notes/NoteForm'
import NoteList from '@/Notes/NoteList'
import FlexBetween from '@/UI/FlexBetween'
import FlexColumn from '@/UI/FlexColumn'
import StyledTooltip from '@/UI/SyledTooltip'


const Notes = React.memo(() => {
  const [isNewNote, setIsNewNote] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const theme = useTheme()

  const isSmallerThanMedium = useMediaQuery(theme.breakpoints.down('md'))

  const toggleDrawer = (event) => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }

    setOpenDrawer(!openDrawer)
  }

  const handleIsNewNote = useCallback(() => {
    setIsNewNote(!isNewNote)
  }, [isNewNote])
 
  return (
    <FlexColumn>
      <FlexBetween>
        <FlexBetween>
          <StyledTooltip
            arrow
            title="Folder list"
            sx={{ display: { sm: "flex", md: "none" } }}
          >
            <IconButton
              onClick={toggleDrawer}
              sx={{
                display: { sm: "flex", md: "none" },
                paddingRight: '1rem',
                color: theme.palette.secondary[400],
                "&:hover": { color: theme.palette.secondary[100] },
              }}
            >
              <FolderIcon />
            </IconButton>
          </StyledTooltip>

          <Typography
            variant="h3"
            color={theme.palette.secondary[400]}
            padding="2rem 0"
            sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }}}
          >
            Well, hello there. What would you like to do?
          </Typography>
        </FlexBetween>

        <FlexBetween>
          <StyledTooltip arrow title="New note">
            <IconButton
              onClick={handleIsNewNote}
              sx={{
                color: theme.palette.secondary[400],
                "&:hover": { color: theme.palette.secondary[100] },
              }}
            >
              <AddIcon sx={{ fontSize: "1rem", marginRight: "-4px" }} />
              <CreateIcon />
            </IconButton>
          </StyledTooltip>
        </FlexBetween>
      </FlexBetween>

      <Box display='flex' height='83.5vh'>
        {isSmallerThanMedium ? null : (
          <>
            <FolderList />
            <NoteList setIsNewNote={setIsNewNote} />
          </>
        )}
        <NoteForm isNewNote={isNewNote} setIsNewNote={setIsNewNote} />
      </Box>

      <Drawer
        openDrawer={openDrawer && isSmallerThanMedium}
        setIsNewNote={setIsNewNote}
        toggleDrawer={toggleDrawer}
      />
    </FlexColumn>
  );
})

Notes.displayName = '/Notes'

export default Notes