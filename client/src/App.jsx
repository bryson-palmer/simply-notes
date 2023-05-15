import { useMemo } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'

import StoreContextProvider from '@/store/store-provider'
import Navbar from '@/Navbar'
import Notes from '@/Notes'
import { themeSettings } from '@/theme'

const App = () => {
  const theme = useMemo(() => createTheme(themeSettings), [])

  return (
    <div className='app'>
        <BrowserRouter>
          <StoreContextProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />

              <Box width='100%' height='100%' padding='1rem 2rem 4rem 2rem'>
                <Navbar />
                <Routes>
                  <Route index element={<Notes />} />
                  <Route path='notes' element={<Notes />} />
                  <Route path='chat' element={<Typography variant="h2" color={theme.palette.secondary[400]}>Lets chat</Typography>} />
                  {/* <Route path='*' element={<404 />} /> */}
                </Routes>
              </Box>

            </ThemeProvider>
          </StoreContextProvider>
        </BrowserRouter>
    </div>
  )
}

export default App
