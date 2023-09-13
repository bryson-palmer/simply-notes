import { useQuery } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { useStore } from '@/store/store'

export default function useGetNote(noteId) {
  const isNewNote = useStore(store => store.isNewNote)
  return useQuery({
    queryKey: ['note', noteId],
    queryFn: () => noteAPI.get(noteId),
    enabled: Boolean(noteId && !isNewNote),
    // keepPreviousData: true,
  })
}