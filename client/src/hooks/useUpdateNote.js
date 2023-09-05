import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.update(note),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] })
  })
}