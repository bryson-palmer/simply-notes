import { useQuery } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
// import { useStore } from '@/store/store'

export default function useNotes(folderId) {
  console.log("🚀 ~ file: useNotes.js:6 ~ useNotes ~ folderId:", folderId)
  // const selectedFolderID = useStore(store => store.selectedFolderID)
  
  return useQuery({
    queryKey: ['notes', folderId],
    queryFn: () => noteAPI.get(folderId),
    // enabled: Boolean(selectedFolderID)
  })
}