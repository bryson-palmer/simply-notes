import { useState } from 'react'

import { Link } from 'react-router-dom'

import PixIcon from '@mui/icons-material/Pix'
import { Box, Typography, useTheme } from '@mui/material'

import FlexBetween from '@/UI/FlexBetween'

const Navbar = () => {
  const [selected, setSelected] = useState('notes')
  const { palette } = useTheme()

  return (
    <FlexBetween
      mb='0.25rem'
      p='0.5rem 0rem'
      color={palette.grey[300]}
    >
      {/* Left Side */}
      <FlexBetween gap='0.75rem'>
        <PixIcon sx={{ fontSize: '28px' }} />
        <Typography variant='h4' fontSize='16px'>
          ToDo
        </Typography>
      </FlexBetween>

      {/* Right Side */}
      <FlexBetween gap='2rem'>
        <Box sx={{ '&:hover': { color: palette.primary[100] } }}>
          <Link
            to='/'
            onClick={() => setSelected('notes')}
            style={{
              color: selected === 'notes' ? 'inherit' : palette.grey[700],
              textDecoration: 'inherit'
            }}
          >
            notes
          </Link>
        </Box>
        <Box sx={{ '&:hover': { color: palette.primary[100] } }}>
          <Link
            to='#chat'
            onClick={() => setSelected('chat')}
            style={{
              color: selected === 'chat' ? 'inherit' : palette.grey[700],
              textDecoration: 'inherit'
            }}
          >
            chat
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  )
}

export default Navbar