import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

import { useStore } from '@/store/store'

export default function useCreateNote() {
  const setIsNewNote = useStore((store) => store.setIsNewNote)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: note => noteAPI.create(note),
    onSuccess: () => {
      setIsNewNote(false)
      return queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })
}