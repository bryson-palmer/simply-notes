import { PropTypes } from 'prop-types/prop-types'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import SvgIcon from '@mui/material/SvgIcon'

const EmptyState = ({ EmptyIcon, isNewFolder=false, text='' }) => {
  const { palette } = useTheme()
  return (
    <>
      {isNewFolder ? null : (
        <Box
          textAlign='center'
          color={palette.grey[400]}
          fontSize='0.875rem'
          padding='1rem 1rem 0'
          sx={{ opacity: 0.6 }}
        >
          {text}
          <Box
            display='flex'
            justifyContent='center'
            alignContent='center'
            mt='1rem'
            position='relative'
          >
            <SvgIcon
              sx={{
                color: palette.grey[100],
                fontSize: '7rem',
                position: 'absolute',
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
                    position: 'absolute',
                    top: '24px',
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