import { useContextSelector } from 'use-context-selector'

import { StoreContext } from '@/store/store-provider'

export const useNotes = () => useContextSelector(StoreContext, store => store.notes)

export const useSelectedNote = () => useContextSelector(StoreContext, store => store.selectedNote)

export const useGetNote = () => useContextSelector(StoreContext, store => store.getNote)

export const useCreateNote = () => useContextSelector(StoreContext, store => store.createNote)

export const useDeleteNote = () => useContextSelector(StoreContext, store => store.deleteNote)

// export const useDeleteAll = () => useContextSelector(StoreContext, store => store.deleteAll)