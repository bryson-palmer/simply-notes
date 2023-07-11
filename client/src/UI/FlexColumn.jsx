import { Box } from '@mui/material'
import { styled } from '@mui/system'

const FlexColumn = styled(Box, {
  shouldForwardProp: prop => prop !== 'isNote'
})(({ isNote }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: isNote ? '80%' : 'inherit',
  minHeight: '100%',
  paddingLeft: isNote ? '2rem' : 0,
}))

export default FlexColumn