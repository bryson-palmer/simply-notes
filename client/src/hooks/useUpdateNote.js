import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { ALL_NOTES_ID } from '@/constants/constants'

const handleUpdate = ({note, previous}) => {
  const updatedList = previous?.map((oldNote) => oldNote.id === note.id ? note : oldNote)

  return updatedList.sort(
    (note1, note2) => note1.last_modified - note2.last_modified
  )
}

export default function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.update(note),
    onSuccess: async (note) => {
      // Updating the note's value in the cache at its specific key
      await queryClient.setQueryData(['note', note.id], note )

      // Update the notes list cache at specefic note
      await queryClient.setQueryData(['notes', note.folder],
        (previous) => {
          if (note.folder === ALL_NOTES_ID) return
          return handleUpdate({note, previous})
        }
      )

      // Update the All Notes list as well
      await queryClient.setQueryData(['notes', ALL_NOTES_ID],
        (previous) => {
          if (!previous) return
          return handleUpdate({note, previous})
        }
      )
    }
  })
}