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
      isNewNote: false,
      setIsNewNote: (bool) => set(() => ({ isNewNote: bool })),
      selectedFolderID: null,
      setSelectedFolderID: (folderId) =>
        set(() => ({ selectedFolderID: folderId })),
      selectedNoteID: null,
      setSelectedNoteID: (id) => set(() => ({ selectedNoteID: id })),
    }),
    {
      // Local Storage key name
      name: "simple-notes",
    }
  )
);