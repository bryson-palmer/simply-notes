import { useContextSelector } from 'use-context-selector'

import { StoreContext } from '@/store/store-provider'

export const useLoadingNotes = () => useContextSelector(StoreContext, store => store.loadingNotes)

export const useNotes = () => useContextSelector(StoreContext, store => store.notes)

export const useSelectedNote = () => useContextSelector(StoreContext, store => store.selectedNote)

export const useGetNote = () => useContextSelector(StoreContext, store => store.getNote)

export const useCreateNote = () => useContextSelector(StoreContext, store => store.createNote)

export const useDeleteNote = () => useContextSelector(StoreContext, store => store.deleteNote)

export const useUpdateNote = () => useContextSelector(StoreContext, store => store.updateNote)

export const useFolders = () => useContextSelector(StoreContext, store => store.folders)

export const useCreateFolder = () => useContextSelector(StoreContext, store => store.createFolder)

export const useDeleteFolder = () => useContextSelector(StoreContext, store => store.deleteFolder)

export const useSelectedFolderID = () => useContextSelector(StoreContext, store => store.selectedFolderID)

export const useSetSelectedFolderID = () => useContextSelector(StoreContext, store => store.setSelectedFolderID)
