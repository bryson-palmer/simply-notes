import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { PropTypes } from 'prop-types/prop-types'

import { noteAPI } from '@/apis/noteAPI'
import { folderAPI } from '@/apis/folderAPI'

const useStore = () => {
  const [notes, setNotes] = useState([])
  const [folders, setFolders] = useState([])
  const [selectedNote, setSelectedNote] = useState({})
  const [selectedFolderID, setSelectedFolderID] = useState('')
  console.log("🚀 ~ file: store-provider.jsx:13 ~ useStore ~ selectedFolderID:", selectedFolderID)

  const getAllNotes = useCallback((folderID) => {
    noteAPI.getAll(folderID)
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
      getNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:54 ~ createNote ~ error:", error)
      return 
    })
  }, [getAllNotes, getNote, selectedFolderID])

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
    noteAPI.update(note)
    .then(data => {
      getAllNotes(selectedFolderID)  // getAllNotes is purely for updating the note in the list form;
      getNote(data)
    })
    .catch(error => { 
      console.log("🚀 ~ file: store-provider.jsx:66 ~ updateNote ~ error:", error)
      return
    })
  }, [getAllNotes, getNote, selectedFolderID])

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
    console.log('Get all folders')
    getAllFolders()
  }, [getAllFolders])  // this cannot depend on folders, or else it refetches folders everytime

  // anytime folders are loaded, make sure a folder is selected (defaults to 0)
  useEffect(() => {
    console.log('Set selected useEffect')
    if (!selectedFolderID && folders.length) {
      console.log('Set selected folder')
      setSelectedFolderID(folders[0]?.id)
    }
  }, [folders, selectedFolderID])

  // anytime a folder is selected, fetch all notes for that folder
  useEffect(() => {
    if (selectedFolderID) {
      console.log('fetching notes by folder')
      getAllNotes(selectedFolderID)
    }
  }, [getAllNotes, selectedFolderID])
  
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