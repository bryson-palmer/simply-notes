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
      setCurrentNote: (note) => set(() => ({ currentNote: { ...note } })),
      isNewNote: false,
      setIsNewNote: (bool) => set(() => ({ isNewNote: bool })),
      selectedFolderID: null,
      setSelectedFolderID: (folderID) =>
        set(() => ({ selectedFolderID: folderID })),
      selectedNoteID: null,
      setSelectedNoteID: (id) => set(() => ({ selectedNoteID: id })),
      noteByFolderID: {},
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
    }),
    {
      // Local Storage key name
      name: 'simple-notes',
    }
  )
)