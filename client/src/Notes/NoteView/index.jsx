import React from 'react'

import PropTypes from 'prop-types'

import { Typography } from '@mui/material'
import { useTheme } from '@emotion/react'

import FlexColumn from '@/UI/FlexColumn'

const NoteView = React.memo(({ selectedNote }) => {
  console.log("🚀 ~ file: index.jsx:25 ~ Note ~ selectedNote:", selectedNote)
  const { palette } = useTheme()
  return (
    <FlexColumn isNote>
      <Typography variant='h1' color={palette.grey[400]}>{selectedNote.title}</Typography>
      <Typography
        variant='h5'
        color={palette.grey[200]}
        lineHeight='1.5rem'
      >
        {selectedNote.body}
      </Typography>
    </FlexColumn>
  )
})

NoteView.displayName = '/NoteView'
NoteView.propTypes = {
  selectedNote: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string
  })
}

export default NoteView