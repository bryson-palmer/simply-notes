import { useQuery, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { useSelectedFolderID } from '@/store/store'

export default function useGetNotes() {
  const queryClient = useQueryClient()
  const selectedFolderID = useSelectedFolderID()
  
  return useQuery({
    queryKey: ['notes', selectedFolderID],
    queryFn: () => noteAPI.getAll(selectedFolderID),
    enabled: Boolean(selectedFolderID),
    onSuccess: (notes) => {
      notes.forEach(note => {
        queryClient.setQueryData(['note', note.id], note)
      })
    }
  })
}