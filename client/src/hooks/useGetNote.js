import { useQuery } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useGetNote(noteId) {
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteAPI.get(noteId),
    enabled: Boolean(noteId)
    // keepPreviousData: true,
  })
}