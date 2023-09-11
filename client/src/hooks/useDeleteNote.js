import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'

export default function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: noteID => noteAPI.delete(noteID),
    onSuccess: (_, noteID) => {
      if (!document.startViewTransition) {
        queryClient.invalidateQueries({ queryKey: ['notes'] })
        return
      }
      
      const listItemEl = document.querySelector(`#note-${noteID}`)
      listItemEl.classList.remove('incoming')
      listItemEl.style.viewTransitionName = 'outgoing'

      const transition = document.startViewTransition()
      if (transition.finished) {
        queryClient.invalidateQueries({ queryKey: ['notes'] })
      }
    }
  })
}