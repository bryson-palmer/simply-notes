import React, { useMemo } from 'react'

import { PropTypes } from 'prop-types/prop-types'

import { Global, useTheme } from '@emotion/react'
import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import SwipeableDrawer from '@mui/material/SwipeableDrawer'

import FolderList from '@/Folders/FolderList'
import useNotes from '@/hooks/useNotes'
import NoteList from '@/Notes/NoteList'
import { useScreenSize } from '@/store/store'

const Drawer = React.memo(({
  drawerWidth,
  openDrawer = false,
  toggleDrawer
}) => {
  const { palette } = useTheme()
  const { data: notes = []} = useNotes()
  const screenSize = useScreenSize()

  const isDesktop = useMemo(() => screenSize === 'desktop' || screenSize === 'large', [screenSize])

  const StyledBox = styled(Box)(() => ({
    display: 'flex',
    transition: 'all 0.35s ease-in-out'
  }))

  return (
    <SwipeableDrawer
      anchor='left'
      open={openDrawer}
      onClose={toggleDrawer}
      onOpen={toggleDrawer}
      variant={isDesktop ? 'permanent' : 'temporary'}
      transitionDuration={400}
    >
      <Global
        styles={{
          '.MuiDrawer-root > .MuiPaper-root': {
            width: `clamp(264px, calc(100% - 1rem), ${drawerWidth()}px)`,
            height: '93vh',
            backgroundColor: palette.background.default,
            overflow: 'hidden',
            marginTop: isDesktop ? 68 : 61,
            borderTopRightRadius: isDesktop ? 0 : 8,
            borderTop: isDesktop ? 'none' : `thin solid ${palette.grey[800]}`,
            borderRight: isDesktop ? 'none' : `thin solid ${palette.grey[800]}`,
            transition: 'all 0.35s ease-in-out'
          },
        }}
      />

      <StyledBox>
        <FolderList />
        <NoteList key={`${notes[0]?.folder}`} />
      </StyledBox>
    </SwipeableDrawer>
  )
})

Drawer.displayName = 'Drawer'
Drawer.propTypes = {
  drawerWidth: PropTypes.func,
  openDrawer: PropTypes.bool,
  toggleDrawer: PropTypes.func,
}

export default Drawer
