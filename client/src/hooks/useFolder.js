import { useQuery } from '@tanstack/react-query'

import { folderAPI } from '@/apis/folderAPI'

export default function useFolder(folderId) {
  return useQuery({
    queryKey: ['folder', folderId],
    queryFn: () => folderAPI.get(folderId),
    enabled: true
  })
}