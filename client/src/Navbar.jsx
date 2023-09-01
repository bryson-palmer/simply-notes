import React, { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import AddIcon from '@mui/icons-material/Add'
import CreateIcon from '@mui/icons-material/Create'
import PixIcon from '@mui/icons-material/Pix'
import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'

import { INITIAL_NOTE } from '@/constants/constants'
import { useScreenSize, useStore } from '@/store/store'
import FlexBetween from '@/ui/FlexBetween'
import StyledTooltip from '@/ui/StyledTooltip'

const Navbar = React.memo(() => {
  const { palette } = useTheme()
  const screenSize = useScreenSize()
  const setIsNewNote = useStore(store => store.setIsNewNote)
  const setSelectedNoteID = useStore(store => store.setSelectedNoteID)
  const selectedFolderID = useStore(store => store.selectedFolderID)
  const setCurrentNote = useStore(store => store.setCurrentNote)

  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])

  const handleIsNewNote = useCallback(() => {
    console.log('[NEW_NOTE]:')
    /*
      When adding a new note,
      reset selected note id and current note
      to stay in sync
      *** Opportunity to move these three into a util function since it gets used a few times ***
    */
    setSelectedNoteID(null)
    setCurrentNote(INITIAL_NOTE)
    setIsNewNote(true)
  }, [setCurrentNote, setIsNewNote, setSelectedNoteID])

  return (
    <FlexBetween
      height={60}
      color={palette.grey[300]}
      position='sticky'
      top={0}
      p='0.5rem 1.5rem 0.5rem 1rem'
      sx={{
        '& > a': {
          textDecoration: 'none',
          color: 'transparent',
          cursor: 'none'
        }
      }}
    >
      {/* Left Side */}
      <Link to='/'>
        <Button
          startIcon={<PixIcon />}
          sx={{
            color: palette.secondary[400],
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            fontWeight: 600,
            textTransform: 'none',
            lineHeight: 1.2,
            '& [class*=MuiButton-startIcon]': {
              marginRight: '6px',
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '2rem' },
              },
            }
          }}
        >
          Simple-Notes
        </Button>
      </Link>

      {/* Right Side */}
      <FlexBetween gap='1rem'>
        <IconButton
          disabled={!selectedFolderID}
          onClick={handleIsNewNote}
          sx={{
            color: palette.secondary[400],
            paddingTop: '1rem',
            '&:hover': { color: palette.secondary[100] },
            '&.Mui-disabled': { color: palette.secondary[400], opacity: 0.5},
            '& [class*=MuiSvgIcon-root]': {
              fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' }
            }
          }}
        >
          <StyledTooltip
            arrow
            title={isDesktop ? 'New note' : ''}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
          >
            <div>
              <AddIcon sx={{ marginRight: '-4px' }} />
              <CreateIcon />
            </div>
          </StyledTooltip>
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  )
})

Navbar.displayName = 'Navbar'

export default Navbar