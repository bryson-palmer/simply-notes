import { useCallback } from 'react'
import { PropTypes } from 'prop-types/prop-types'
import { Link } from 'react-router-dom'

import { Add as AddIcon, Create as CreateIcon, Pix as PixIcon } from '@mui/icons-material'
import { Button, Fade, IconButton,  useTheme } from '@mui/material'

import { useFolders } from '@/store/store-selectors'
import FlexBetween from '@/ui/FlexBetween'
import StyledTooltip from '@/ui/StyledTooltip'

const Navbar = ({ setIsNewNote }) => {
  const { palette } = useTheme()
  const folders = useFolders()

  const handleIsNewNote = useCallback(() => {
    setIsNewNote(true)
  }, [setIsNewNote])

  return (
    <FlexBetween
      m='0 -4px'
      mb='0.25rem'
      p='0.5rem 0rem'
      color={palette.grey[300]}
    >
      {/* Left Side */}
      <Link to='/'>
        <Button
          startIcon={<PixIcon />}
          sx={{
            color: palette.secondary[400],
            fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.5rem' },
            fontWeight: 600,
            textTransform: 'none',
            lineHeight: 1.2,
            '& [class*=MuiButton-startIcon]': {
              marginRight: '6px',
              '& > svg': {
                fontSize: { xs: '1.5rem', sm: '1.5rem', md: '2rem' },
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
          disabled={!folders.length}
          onClick={handleIsNewNote}
          sx={{
            color: palette.secondary[400],
            '&:hover': { color: palette.secondary[100] },
            '&.Mui-disabled': { color: palette.secondary[400], opacity: 0.5},
            '& [class*=MuiSvgIcon-root]': {
              fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.5rem' }
            }
          }}
        >
          <StyledTooltip
            arrow
            title='New note'
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 400 }}
          >
            <>
              <AddIcon sx={{ marginRight: '-4px' }} />
              <CreateIcon />
            </>
          </StyledTooltip>
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  )
}

Navbar.displayName = 'Navbar'
Navbar.propTypes = {
  setIsNewNote: PropTypes.func
}

export default Navbar