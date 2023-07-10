import React from 'react'

import { PropTypes } from 'prop-types/prop-types'

import { Global, useTheme } from '@emotion/react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import FolderList from '@/Folders/FolderList'
import NoteList from '@/Notes/NoteList'

const Drawer = React.memo(({
  openDrawer = false,
  setIsNewNote,
  toggleDrawer
}) => {
  const { palette } = useTheme()

  const StyledBox = styled(Box)(() => ({
    backgroundColor: palette.background.light,
    display: 'flex',
    width: 400,
    height: '100%',
    borderTop: `1px solid ${palette.grey[800]}`,
  }))

  return (
    <SwipeableDrawer
      anchor='left'
      open={openDrawer}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
    >
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            marginTop: 151,
            borderTopRightRadius: 8
          },
        }}
      />

      <StyledBox>
        <FolderList />
        <NoteList setIsNewNote={setIsNewNote} />
      </StyledBox>
    </SwipeableDrawer>
  )
})

Drawer.displayName = 'Drawer'
Drawer.propTypes = {
  openDrawer: PropTypes.bool,
  setIsNewNote: PropTypes.func,
  toggleDrawer: PropTypes.func
}

export default Drawer
