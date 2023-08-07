import { useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'

import { Add as AddIcon, Create as CreateIcon, Pix as PixIcon } from '@mui/icons-material'
import { Button, Fade, IconButton,  useTheme } from '@mui/material'

import useFolders from '@/hooks/useFolders'
import { useScreenSize, useStore } from '@/store/store'
import FlexBetween from '@/UI/FlexBetween'
import StyledTooltip from '@/UI/StyledTooltip'

const Navbar = () => {
  const { palette } = useTheme()
  const { data, isLoading, isError} = useFolders() // React Query folders
  const screenSize = useScreenSize()
  const setIsNewNote = useStore(store => store.setIsNewNote)

  const isDesktop = useMemo(() => screenSize === 'large' || screenSize === 'desktop', [screenSize])
  const isDisabled = useMemo(() => isLoading || isError || !data?.length, [data?.length, isError, isLoading])

  const handleIsNewNote = useCallback(() => {
    setIsNewNote(true)
  }, [setIsNewNote])

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
          disabled={isDisabled}
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
}

Navbar.displayName = 'Navbar'

export default Navbar