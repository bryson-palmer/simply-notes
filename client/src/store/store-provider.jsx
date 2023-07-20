import { useCallback, useEffect, useMemo, useState } from 'react'
import { createContext } from 'use-context-selector'
import { PropTypes } from 'prop-types/prop-types'

import { noteAPI } from '@/apis/noteAPI'
import { folderAPI } from '@/apis/folderAPI'
import { useMediaQuery, useTheme } from '@mui/material'

const useStore = () => {
  const [folders, setFolders] = useState([])
  const [isNewNote, setIsNewNote] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState({})
  const [selectedFolderID, setSelectedFolderID] = useState('')

  const { breakpoints } = useTheme()

  const isDesktopSize = useMediaQuery(breakpoints.up('md'))
  const isTabletSize = useMediaQuery(breakpoints.down('lg') && breakpoints.down('md'))
  const isMobileSize = useMediaQuery(breakpoints.down('sm'))

  const screenSize = useMemo(() => {
    if (isDesktopSize) return 'desktop'
    if (isTabletSize && !isMobileSize) return 'tablet'
    if (isMobileSize && isTabletSize) return 'mobile'
  }, [isDesktopSize, isMobileSize, isTabletSize])

  const getAllNotes = useCallback((folderID) => {
    setLoadingNotes(true)
    noteAPI.getAll(folderID)
    .then(data => {
      setNotes(data)
    })
    .then(() => setLoadingNotes(false))
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:19 ~ getAllNotes ~ error:", error)
      return 
    })
  }, [])

  const getAllFolders = useCallback(() => {
    folderAPI.getAll()
    .then(data => {
      setFolders(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:31 ~ getAllFolders ~ error:", error)
      return 
    })
  }, [])

  const getNote = useCallback(id => {
    noteAPI.get(id)
    .then(data => {
      setSelectedNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:42 ~ getNote ~ error:", error)
      return 
    })
  }, [])

  const createNote = useCallback(note => {
    noteAPI.create(note)
    .then(data => {
      getAllNotes(selectedFolderID)  // always fetch by folder ID, it should work if folder id is null too
      setSelectedNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:54 ~ createNote ~ error:", error)
      return 
    })
  }, [getAllNotes, selectedFolderID])

  const createFolder = useCallback(folder => {
    folderAPI.create(folder)
    .then(() => {
      getAllFolders()
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:54 ~ createNote ~ error:", error)
      return 
    })
  }, [getAllFolders])

  const updateNote = useCallback(note => {
    setSelectedNote(note)  // to avoid overwriting user as he continues typing
    noteAPI.update(note)
    .then(() => {
      /*
        Moving the setSelectedNote(note/data) to before the call with the note or after the response with data doesn't matter (that I can tell) for these issues.
          - An empty title in the NoteForm, doesn't clear the title in the selectedNote in the NoteList.
          - With slower network connections or throttling, updating a note lags behind and makes for a janky typing experience.
          - When saving a new note, note[0] flashes on the screen for a moment before the newly created note is selected.

        I think the solution needs to be made in the NoteForm where we better handle a few things.
          1. Create a local state for form values and display them always as the source of truth. They will be the latest changes to the form. The saving will just happen behind the scenes.
          2. Make sure that the initialValues are being set up properly.
          3. Perhaps avoid submitting the values if we're currently submitting or loading.

        More testing is needed. Maybe even write some tests.
      */
      // nothing anymore. We know the note contents already (it's in note variable)
      // unless... unless it has a newer note modification date, then we need to load the newer data in
      // TODO: what it says above
    })
    .catch(error => { 
      console.log("🚀 ~ file: store-provider.jsx:66 ~ updateNote ~ error:", error)
      return
    })
  }, [])

  const deleteNote = useCallback(id => {
    noteAPI.delete(id)
    .then(() => {
      setSelectedNote({})
      getAllNotes(selectedFolderID)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:78 ~ deleteNote ~ error:", error)
      return 
    })
  }, [getAllNotes, selectedFolderID])


  const deleteFolder = useCallback(id => {
    folderAPI.delete(id)
    .then(() => {
      getAllFolders()
      setSelectedFolderID(null)  // causes folder 0 to be selected
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:102 ~ deleteFolder ~ error:", error)
      return 
    })
  }, [getAllFolders])

  // on first load, fetch all folders
  useEffect(() => {
    getAllFolders()
  }, [getAllFolders])  // this cannot depend on folders, or else it refetches folders everytime

  // anytime folders are loaded, make sure a folder is selected (defaults to 0)
  useEffect(() => {
    if (!selectedFolderID && folders.length) {
      setSelectedFolderID(folders[0]?.id)
    }
  }, [folders, selectedFolderID])

  // anytime a folder is selected, fetch all notes for that folder
  useEffect(() => {
    if (selectedFolderID) {
      getAllNotes(selectedFolderID)
    }
  }, [getAllNotes, selectedFolderID])
  
  useEffect(() => {
    if (loadingNotes) return // Don't continue with side effect if loading is true
    const isSelectedInNotes = notes.some(note => note.id === selectedNote.id)
    // Deleted all notes
    if (!notes?.length && selectedNote.id) {
      setSelectedNote({})
      // Deleted the selectedNote
    } else if (notes.length && (!selectedNote?.id || !isSelectedInNotes)) {
      setSelectedNote(notes[0])
      // Default set user selected note
    } else {
      setSelectedNote(selectedNote)
    }
  }, [loadingNotes, notes, selectedNote]) // anytime these three variables change, trigger this useEffect

  return {
    isNewNote,
    setIsNewNote,
    screenSize,
    loadingNotes,
    notes,
    selectedNote,
    getNote: id => getNote(id),
    createNote: note => createNote(note),
    updateNote: note => updateNote(note),
    deleteNote: id => deleteNote(id),
    folders,
    selectedFolderID,
    setSelectedFolderID,
    createFolder: folder => createFolder(folder),
    deleteFolder: id => deleteFolder(id),
  }
}

export const StoreContext = createContext(null)

const StoreContextProvider = ({ children }) => (
  <StoreContext.Provider value={useStore()}>{children}</StoreContext.Provider>
)

StoreContextProvider.displayName = 'store-provider'
StoreContextProvider.propTypes = {
  children: PropTypes.node
}

export default StoreContextProvider