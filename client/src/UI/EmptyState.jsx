import { PropTypes } from 'prop-types/prop-types'
import { Box, SvgIcon } from '@mui/material'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useTheme } from '@emotion/react'

const EmptyState = ({ EmptyIcon, isNewFolder=false, text='' }) => {
  const { palette } = useTheme()
  return (
    <>
      {isNewFolder ? null : (
        <Box
          textAlign='center'
          color={palette.grey[400]}
          fontSize='0.875rem'
          padding='0 1rem'
          sx={{ opacity: 0.6 }}
        >
          {text}
          <Box mt='1rem' position='relative'>
            <SvgIcon
              sx={{
                color: palette.grey[100],
                fontSize: '7rem',
                position: 'relative',
                background: 'transparent',
                stroke: palette.background.default,
                zIndex: 1
              }}
            >
              <NotInterestedIcon />
            </SvgIcon>
            
            {EmptyIcon ? (
              <SvgIcon
                sx={{
                    color: palette.grey[100],
                    fontSize: '4rem',
                    position: 'relative',
                    bottom: '94px',
                    left: 0,
                }}
              >
                <EmptyIcon />
              </SvgIcon>
            ) : null}
          </Box>
        </Box>
      )}
    </>
  )
}

EmptyState.displayName = 'EmptyState'
EmptyState.propTypes = {
  EmptyIcon: PropTypes.func,
  isNewFolder: PropTypes.bool,
  text: PropTypes.string,
}

export default EmptyState