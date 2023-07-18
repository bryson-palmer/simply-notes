import { PropTypes } from 'prop-types/prop-types'
import { Box } from '@mui/material'
import { useTheme } from '@emotion/react'

const EmptyState = ({ text }) => {
  const { palette } = useTheme()
  return (
    <Box
      textAlign='center'
      color={palette.secondary[400]}
      fontSize='0.875rem'
      padding='0 1rem'
    >
      {text}
    </Box>
  )
}

EmptyState.displayName = 'EmptyState'
EmptyState.propTypes = {
  text: PropTypes.string,
}

export default EmptyState