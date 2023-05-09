import { createContext, useReducer } from 'react'

import PropTypes from 'prop-types'

import storeReducer, { STORE_INITIAL_STATE } from '@/Providers/store.reducer'
import storeTypes from '@/Providers/store.types'

export const StoreContext = createContext({
  ...STORE_INITIAL_STATE
})

const StoreProvider = ({ children }) => {
  const [store, dispatch] = useReducer(storeReducer, STORE_INITIAL_STATE)

  const createNote = note => {
    dispatch({
      type: storeTypes.CREATE_NOTE,
      payload: note
    })
  }

  const removeNote = noteId => {
    dispatch({
      type: storeTypes.REMOVE_NOTE,
      payload: noteId
    })
  }

  return (
    <StoreContext.Provider
      value={{
        store,
        createNote,
        removeNote,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

StoreProvider.propTypes = {
  children: PropTypes.node
}

export default StoreProvider