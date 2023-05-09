import { v4 as uuid } from 'uuid'

import storeTypes from '@/Providers/store.types'
import { removeFromArray } from '@/Providers/store.utils'

export const STORE_INITIAL_STATE = {
  notes: [
    { id: uuid(), title: 'Note 1', body: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.'},
    { id: uuid(), title: 'Note 2', body: 'Abc xyz.'},
    { id: uuid(), title: 'Note 3', body: 'Abc xyz.'},
    { id: uuid(), title: 'Note 4', body: 'Abc xyz.'},
    { id: uuid(), title: 'Note 5', body: 'Abc xyz.'},
  ],
  chat: {
    prompt: 'A smart AI prompt.',
    response: 'A smart AI response.'
  }
}

const storeReducer = (state, action) => {
  switch(action.type) {
    case storeTypes.CREATE_NOTE:
      return {
        ...state,
        notes: [
          ...state.notes,
          action.payload
        ]
      }
      case storeTypes.REMOVE_NOTE:
        return {
          ...state,
          notes: removeFromArray(action.payload, state.notes)
        }
    default:
      return state
  }
}

export default storeReducer