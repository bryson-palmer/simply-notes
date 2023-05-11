import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import { Box, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { themeSettings } from '@/theme'
import Navbar from '@/Navbar'
// import Chat from '@/Chat'
// import { useTheme } from '@emotion/react'

function App() {
  const theme = useMemo(() => createTheme(themeSettings),[])
  // const {palette} = useTheme() // you will use this everywhere else, but not here
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline/>
          <Box width="100%" height="90%" padding="1rem 2rem 4rem 2rem">
            <Navbar/>
            <Routes>
              <Route index element={<Notes/>}/>
              <Route path="notes" element={<Notes/>}/>
              <Route path="chat" element={
                <Typography variant="h2" color={theme.palette.secondary[400]}>Lets chat</Typography>
              }/>
              {/* <Route path="*" element={<Err404></Err404>}></Route> */}




            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
