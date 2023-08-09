import React, { useState } from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import Drawer from '@/Drawer'
import NoteForm from '@/Notes/NoteForm'
import { useScreenSize } from '@/store/store'

const Notes = React.memo(() => {
  const [openDrawer, setOpenDrawer] = useState(false)

  const theme = useTheme()
  const screenSize = useScreenSize()
  
  const { palette } = theme
  const isDesktop = screenSize === 'large' || screenSize === 'desktop'

  const drawerWidth = () => {
    if (screenSize === 'large') return 600
    if (screenSize === 'tablet') return 500
    if (screenSize === 'desktop' || screenSize === 'mobile') return 400
  }

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
      <Box component='aside' aria-label='folders notes' transition='all 0.35s ease-in-out'>
        <Box height='3.75rem' paddingLeft='0.5rem' transition='all 0.35s ease-in-out'>
          <Button
            disableRipple
            onClick={toggleDrawer}
            startIcon={<ArrowBackIosNewIcon />}
            sx={{
              display: { sm: 'flex', md: 'none' },
              justifyContent: 'flex-start',
              color: palette.grey[400],
              fontSize: { xs: '0.6rem', sm: '0.75rem' },
              '&:hover': { color: palette.secondary[100] },
              '& [class*=MuiButton-startIcon]': {
                marginRight: '6px',
                '& > svg': {
                  fontSize: { xs: '1.2rem', sm: '1.5rem', md: 'none' },
                },
              }
            }}
          >
            Folders
          </Button>
        </Box>

        <Drawer
          openDrawer={openDrawer}
          toggleDrawer={toggleDrawer}
          drawerWidth={drawerWidth}
        />
      </Box>
      <Box
        component='main'
        sx={{
          width: isDesktop ? `calc(100% - ${drawerWidth()}px)` : '100%',
          transition: 'all 0.35s ease-in-out',
          height: '93vh',
          overflow: 'auto',
          padding: isDesktop ? 3 : 3.5,
          paddingTop: isDesktop ? '60px' : 'initial'
        }}
      >
        <NoteForm />
      </Box>
    </Box>
  );
})

Notes.displayName = '/Notes'

export default Notes