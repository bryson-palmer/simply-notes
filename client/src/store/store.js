import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

export const useScreenSize = () => {
  const { breakpoints } = useTheme()

  const isLargeSize = useMediaQuery(breakpoints.up('lg'))
  const isDesktopSize = useMediaQuery(breakpoints.up('md'))
  const isTabletSize = useMediaQuery(breakpoints.down('lg') && breakpoints.down('md'))
  const isMobileSize = useMediaQuery(breakpoints.down('sm'))

  const screenSize = useMemo(() => {
    if (isLargeSize) return 'large'
    if (isDesktopSize) return 'desktop'
    if (isTabletSize && !isMobileSize) return 'tablet'
    if (isMobileSize && isTabletSize) return 'mobile'
  }, [isDesktopSize, isLargeSize, isMobileSize, isTabletSize])

  return screenSize
}

export const useStore = create(
  persist(
    (set) => ({
      currentNote: null,
      isNewNote: false,
      newNoteID: null,
      selectedFolderID: null,
      selectedNoteID: null,
      noteByFolderID: {},
      actions: {
        setCurrentNote: (note) => set(() => ({ currentNote: { ...note } })),
        setIsNewNote: (bool) => set(() => ({ isNewNote: bool })),
        setNewNoteID: (id) => set(() => ({ newNoteID: id })),
        setSelectedFolderID: (folderID) =>
          set(() => ({ selectedFolderID: folderID })),
        setSelectedNoteID: (id) => set(() => ({ selectedNoteID: id })),
        /*
          we're slightly abusing a setter here; we actually update store.noteByFolderID, then return it
          to be store via the setter
        */
        setNoteByFolderID: (
          folderID = null,
          noteID = null,
          removeFolderKey = false
        ) =>
          set((store) => {
            if (removeFolderKey) {
              // When removeFolderKey is true, delete the folder property from the lookup
              delete store.noteByFolderID[folderID];
            } else {
              // Set folderID key with the value of the noteID
              store.noteByFolderID[folderID] = noteID;
            }
            return store.noteByFolderID;
          }),
      },
    }),
    {
      // Local Storage key name
      name: 'simple-notes',
    }
  )
)

export const useCurrentNote = () => useStore(state => state.currentNote)
export const useIsNewNote = () => useStore(state => state.isNewNote)
export const useNewNoteID = () => useStore(state => state.newNoteID)
export const useSelectedFolderID = () => useStore(state => state.selectedFolderID)
export const useSelectedNoteID = () => useStore(state => state.selectedNoteID)
export const useNoteByFolderID = () => useStore(state => state.noteByFolderID)
export const useStoreActions = () => useStore(state => state.actions)