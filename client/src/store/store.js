import { create } from 'zustand'

const store = set => ({
  folders: [{ id: '123', folderName: 'Folder X', userId: 'xyz'}], // The store would do best to track all of the current useState vars in store-provider
  addFolder: (folder, state) => //  This should be where we add react query
    set(store => ({ folders: [...store.folders, { folder, state }] }),
    false, // For telling zustand if you want everything in the store to be replaced or just what's in the object here
    'addFolder' // For debugging with redux devtools if using
  ),
  deleteFolder: folder => 
    set(store => ({ folders: store.folders.filter(f => f.id !== folder.id) })),
})

export const useStore = create(store)