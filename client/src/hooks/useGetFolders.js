import { useQuery } from '@tanstack/react-query'

import { folderAPI } from '@/apis/folderAPI'

export default function useGetFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: () => folderAPI.getAll(),
  })
}