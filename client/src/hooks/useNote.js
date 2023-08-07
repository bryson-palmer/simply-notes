import { useQuery } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useNote(noteId) {
  return useQuery({
    queryKey: ['notes', noteId],
    queryFn: () => noteAPI.get(noteId),
    enabled: true
  })
}