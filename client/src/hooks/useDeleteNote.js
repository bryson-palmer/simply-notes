import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: noteId => noteAPI.delete(noteId),
    onSuccess: () => queryClient.invalidateQueries('notes')
  })
}