import { useMutation, useQueryClient } from '@tanstack/react-query'

import { folderAPI } from '@/apis/folderAPI'

export default function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: folder => folderAPI.create(folder),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['folders'] })
  })
}