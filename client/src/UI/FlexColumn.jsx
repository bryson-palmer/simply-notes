import { Box } from '@mui/material'
import { styled } from '@mui/system'

const FlexColumn = styled(Box, {
  shouldForwardProp: prop => prop !== 'isNote'
})(({ isNote }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: isNote ? '80%' : 'inherit',
  minHeight: isNote ? '100%' : 'inherit',
  paddingLeft: isNote ? '2rem' : 0,
}))

export default FlexColumn