import { useQuery } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { useStore } from '@/store/store'

export default function useNotes() {
  const selectedFolderID = useStore(store => store.selectedFolderID)
  
  return useQuery({
    queryKey: ['notes', selectedFolderID],
    queryFn: () => noteAPI.getAll(selectedFolderID),
    enabled: Boolean(selectedFolderID),
  })
}