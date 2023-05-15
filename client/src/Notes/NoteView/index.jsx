import React from 'react'

import { Typography } from '@mui/material'
import { useTheme } from '@emotion/react'

import { useSelectedNote } from '@/store/store-selectors'
import FlexColumn from '@/UI/FlexColumn'

const NoteView = React.memo(() => {
  const { palette } = useTheme()
  const selectedNote = useSelectedNote()
  console.log("🚀 ~ file: index.jsx:12 ~ NoteView ~ selectedNote:", selectedNote)

  return (
    <FlexColumn isNote>
      {selectedNote ? (
        <>
          <Typography variant="h1" color={palette.grey[400]}>
            {selectedNote.title}
          </Typography>
          <Typography
            variant="h5"
            color={palette.grey[200]}
            lineHeight="1.5rem"
          >
            {selectedNote.body}
          </Typography>
        </>
      ) : null}
    </FlexColumn>
  )
})

NoteView.displayName = '/NoteView'

export default NoteView