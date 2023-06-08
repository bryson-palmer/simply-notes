import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { PropTypes } from 'prop-types/prop-types'

import { noteAPI } from '@/apis/noteAPI'
import { folderAPI } from '@/apis/folderAPI'

const useStore = () => {
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedNote, setSelectedNote] = useState({})

  const getAllNotes = useCallback(() => {
    noteAPI.getAll()
    .then(data => {
      setNotes(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:19 ~ getAllNotes ~ error:", error)
      return 
    })
  }, [])

  const getAllFolders = useCallback(() => {
    folderAPI.getAll()
    .then(data => {
      // console.log("folder data:", data)
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
      getAllNotes()
      getNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:54 ~ createNote ~ error:", error)
      return 
    })
  }, [getAllNotes, getNote])

  const createFolder = useCallback(folder => {
    folderAPI.create(folder)
    .then(data => {
      getAllNotes()
      getNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:54 ~ createNote ~ error:", error)
      return 
    })
  }, [getAllNotes, getNote])

  const updateNote = useCallback(note => {
    noteAPI.update(note)
    .then(data => {
      getAllNotes()
      getNote(data)
    })
    .catch(error => { 
      console.log("🚀 ~ file: store-provider.jsx:66 ~ updateNote ~ error:", error)
      return
    })
  }, [getAllNotes, getNote])

  const deleteNote = useCallback(id => {
    noteAPI.delete(id)
    .then(() => {
      setSelectedNote({})
      getAllNotes()
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:78 ~ deleteNote ~ error:", error)
      return 
    })
  }, [getAllNotes])

  // render / load notes on first load ??
  useEffect(() => getAllNotes(), [getAllNotes])
  useEffect(() => getAllFolders(), [getAllFolders])
  
  useEffect(() => {
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
  }, [notes, selectedNote]) // anytime these two variables change, trigger this useEffect

  return {
    notes,
    selectedNote,
    getNote: id => getNote(id),
    createNote: note => createNote(note),
    updateNote: note => updateNote(note),
    deleteNote: id => deleteNote(id),
    folders,
    createFolder: folder => createFolder(folder)
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