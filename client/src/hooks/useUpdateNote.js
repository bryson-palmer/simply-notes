import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.update(note),
    onSuccess: async (newNote) => {
      console.log("🚀 ~ file: useUpdateNote.js:10 ~ useUpdateNote ~ note:", newNote)
      // Updating the note's value in the cache at its specific key
      await queryClient.setQueryData(['note', newNote.id], newNote )

      // Update the notes list cache at specefic note
      await queryClient.setQueryData(['notes', newNote.folder],
        (previous) => previous.map(oldNote => oldNote.id === newNote.id ? newNote : oldNote))
    }
  })
}