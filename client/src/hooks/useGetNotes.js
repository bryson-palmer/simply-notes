import { useQuery, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { useStore } from '@/store/store'

export default function useGetNotes() {
  const queryClient = useQueryClient()
  const selectedFolderID = useStore(store => store.selectedFolderID)
  
  return useQuery({
    queryKey: ['notes', selectedFolderID],
    queryFn: () => noteAPI.getAll(selectedFolderID),
    enabled: Boolean(selectedFolderID),
    onSuccess: (notes) => {
      console.log('notes', notes)
      notes.forEach(note => {
        queryClient.setQueryData(['note', note.id], note)
      })
    }
    // keepPreviousData: true,
  })
}