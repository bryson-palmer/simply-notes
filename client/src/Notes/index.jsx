import React, { useCallback, useState } from 'react'

import { Box, Fade, IconButton, Typography, useMediaQuery } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import FolderIcon from '@mui/icons-material/Folder'
import { useTheme } from '@emotion/react'

import Drawer from '@/Drawer'
import FolderList from '@/Folders/FolderList'
import NoteForm from '@/Notes/NoteForm'
import { useScreenSize } from '@/store/store-selectors'

const Notes = React.memo(() => {
  const [isNewNote, setIsNewNote] = useState(false)
  const [openDrawer, setOpenDrawer] = useState(false)

  const theme = useTheme()
  const folders = useFolders()
  const notes = useNotes()

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
 
  return (
    <Box
      display='flex'
      justifyContent='flex-end'
      height='100vh'
      overflow='hidden'
      flexDirection={isDesktop ? 'row' : 'column'}
          >
            <IconButton
              onClick={toggleDrawer}
              sx={{
                display: { sm: 'flex', md: 'none' },
                paddingRight: '1rem',
                color: theme.palette.secondary[400],
                '&:hover': { color: theme.palette.secondary[100] },
              }}
            >
              <FolderIcon />
            </IconButton>
          </StyledTooltip>

          <Typography
            variant='h3'
            color={theme.palette.secondary[400]}
            padding='2rem 0'
            sx={{ fontSize: { xs: '0.875rem', sm: '1.25rem' }}}
          >
            Well, hello there. What would you like to do?
          </Typography>
        </FlexBetween>

        <FlexBetween>
            <IconButton
              disabled={!folders.length}
              onClick={handleIsNewNote}
              sx={{
                color: theme.palette.secondary[400],
                '&:hover': { color: theme.palette.secondary[100] },
                '&.Mui-disabled': { color: theme.palette.secondary[400], opacity: 0.5}

              }}
            >
              <StyledTooltip
                arrow
                title='New note'
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 400 }}
              >
                <AddIcon sx={{ fontSize: '1rem', marginRight: '-4px' }} />
              </StyledTooltip>
              <CreateIcon />
            </IconButton>
        </FlexBetween>
      </FlexBetween>

      <Box display='flex' height='83.5vh'>
        {isSmallerThanMedium ? null : (
          <>
            <FolderList />
            <NoteList key={`${notes[0]?.folder}`} setIsNewNote={setIsNewNote} />
          </>
        )}
        <NoteForm isNewNote={isNewNote} setIsNewNote={setIsNewNote} />
      </Box>
    </Box>
  );
})

Notes.displayName = '/Notes'

export default Notes