import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.create(note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  })
}