import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { ALL_NOTES_ID } from '@/constants/constants'

const handleRemoval = ({ noteID, previous }) => {
  const updatedList = previous?.filter(oldNote => {
    if (Array.isArray(noteID)) {
      return !noteID.includes(oldNote.id)
    } else {
      return oldNote.id !== noteID
    }
  })
  
  return updatedList.sort(
    (note1, note2) => note1.last_modified - note2.last_modified
  )
}

export default function useDeleteNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data) => {
      const { id: noteID } = data
      
      return noteAPI.delete(noteID)
    },
    onSuccess: async (_, data) => {
      const { folder, id: noteID } = data

      // Remove the query key or list of keys and their notes form cache
      if (Array.isArray(noteID)) {
        noteID.forEach(id =>
          queryClient.removeQueries(["note", id], { exact: true })
        )
      } else {
        queryClient.removeQueries(['note', noteID], { exact: true })
      }

      // Removing the note from the note's list
      await queryClient.setQueryData(['notes', folder],
        (previous) => {
          if (folder === ALL_NOTES_ID) return
          return handleRemoval({ noteID, previous })
        }
      )

      // Removing the note from the All Notes list as well
      await queryClient.setQueryData(['notes', ALL_NOTES_ID],
        (previous) => {
          if (!previous) return
          return handleRemoval({ noteID, previous })
        }
      )
    }
  })
}