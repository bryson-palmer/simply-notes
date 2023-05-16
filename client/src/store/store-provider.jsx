import { useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { PropTypes } from 'prop-types/prop-types'

import { noteAPI } from '@/apis/noteAPI'

const useStore = () => {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)

  const getAllNotes = useCallback(() => {
    noteAPI.getAll()
    .then(data => {
      setNotes(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:18 ~ getAllNotes ~ error:", error)
      return 
    })
  }, [])

  const getNote = useCallback(id => {
    noteAPI.get(id)
    .then(data => {
      setSelectedNote(data)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:29 ~ getNote ~ error:", error)
      return 
    })
  }, [])

  const createNote = useCallback(note => {
    noteAPI.create(note)
    .then(data => {
      getAllNotes()
      getNote(data.id)
    })
    .catch(error => {
      console.log("🚀 ~ file: store-provider.jsx:41 ~ createNote ~ error:", error)
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
      console.log("🚀 ~ file: store-provider.jsx:53 ~ deleteNote ~ error:", error)
      return 
    })
  }, [getAllNotes])

  // const deleteAll = useCallback(() => {
  //   console.log('In the deleteAll call')
  //   noteAPI.deleteAll()
  //   .then(() => {
  //     console.log('Made it passed the api call')
  //     setSelectedNote({})
  //   })
  //   .catch(error => console.log("🚀 ~ file: store-provider.jsx:48 ~ deleteAll ~ error:", error))
  // }, [])

  // render / load notes on first load ??
  useEffect(() => getAllNotes(), [getAllNotes])
  
  useEffect(() => {
    // if !notes, create newNote (no notes or deleted all notes)
    // if !selectedNote (because deletion), set the first one
    // default set the selectedNote from user click

    if (!selectedNote) return setSelectedNote(notes[0])
    setSelectedNote(selectedNote)
  }, [notes, selectedNote]) // anytime these two variables change, trigger this useEffect

  return {
    notes,
    selectedNote,
    getNote: id => getNote(id),
    createNote: note => createNote(note),
    deleteNote: id => deleteNote(id),
    // deleteAll: () => deleteAll()
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