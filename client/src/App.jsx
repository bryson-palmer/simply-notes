import { useMemo } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material'
import Box from '@mui/material/Box'
import { createTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import Navbar from '@/Navbar'
import Notes from '@/Notes'
import { themeSettings } from '@/theme'

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings), [])

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          <Box width='100%' height='100%' position='fixed' overflow='hidden'>
            <Navbar />
            <Routes>
              <Route index element={<Notes />} />
              <Route path='notes' element={<Notes />} />
              <Route
                path='chat'
                element={
                  <Typography variant='h2' color={theme.palette.secondary[400]}>
                    Lets chat
                  </Typography>
                }
              />
              {/* <Route path='*' element={<404 />} /> */}
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
