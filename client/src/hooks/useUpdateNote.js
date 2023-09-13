import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.update(note),
    onSuccess: (newNote) => {
      console.log("🚀 ~ file: useUpdateNote.js:10 ~ useUpdateNote ~ note:", newNote)
      // Updating the cache key for the specific note
      queryClient.setQueryData(['note', newNote.id], newNote )
      // queryClient.setQueryData(['notes', newNote.folder], (previous) => {
      //   console.log("🚀 ~ file: useUpdateNote.js:14 ~ queryClient.setQueryData ~ previous:", previous)
      //   previous.map(oldNote => oldNote.id == newNote.id ? newNote : oldNote)
      // })
      // queryClient.invalidateQueries({ queryKey: ['notes', note.folder, note.id] })
    }
  })
}