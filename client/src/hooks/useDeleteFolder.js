import { useMutation, useQueryClient } from '@tanstack/react-query'

import { folderAPI } from '@/apis/folderAPI'

export default function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: folderId => folderAPI.delete(folderId),
    onSuccess: () => queryClient.invalidateQueries('folders')
  })
}