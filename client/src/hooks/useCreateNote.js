import { flushSync } from 'react-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { noteAPI } from '@/apis/noteAPI'
import { ALL_NOTES_ID } from '@/constants/constants'

const handleInsertion = ({ newNote, previous }) => {
  const newList = [newNote, ...previous]

  return newList.sort(
    (note1, note2) => note1.last_modified - note2.last_modified
  )
}

const addNoteAnimation = async newNoteID => {
  const listItemEl = document.querySelector(`#note-${newNoteID}`)
  listItemEl.classList.add('incoming')
  console.log('listItemEl 1', listItemEl)
}

const addQueryKeys = async ({ newNote, queryClient}) => {
  // Adding query key in the cache with the note as value
  await queryClient.setQueryData(["note", newNote.id], newNote)

  // Adding note to the front of notes list cache
  await queryClient.setQueryData(['notes', newNote.folder], (previous) => {
    if (newNote.folder === ALL_NOTES_ID) return
    return handleInsertion({ newNote, previous })
  })

  // Adding note to the front of All Notes list as well
  await queryClient.setQueryData(['notes', ALL_NOTES_ID], (previous) => {
    if (!previous) return
    return handleInsertion({ newNote, previous })
  })
}

export default function useCreateNote() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: newNote => noteAPI.create(newNote),
    onSuccess: async (newNote) => {
      if (!document.startViewTransition) {
        return addQueryKeys({ newNote, queryClient })
      }

      await addQueryKeys({ newNote, queryClient })

      await document.startViewTransition(async () => {
        flushSync(() => {
          addNoteAnimation(newNote.id)
        })
      })
    }
  })
}