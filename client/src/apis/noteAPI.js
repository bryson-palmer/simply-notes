import { api } from "./configs/axiosConfigs"
import { defineCancelApiObject } from "./configs/axiosUtils"

export const noteAPI = {
  getAll: async (folderID, cancel = false) => {
    const response = await api.request({
      url: "/notes",
      method: "GET",
      params: {
        folder: folderID,  // backend handles ok if this variable is null
      },
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    })

    return response.data
  },
  get: async (id, cancel = false) => {
    const response = await api.request({
      url: `/notes/${id}`,
      method: "GET",
      // retrieving the signal value by using the property name
      signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    })

    // returning the note returned by the API
    return response.data
  },
  create: async (note, cancel = false) => {
    const response = await api.request({
      url: `/notes`,
      method: "POST",
      data: note,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })

    return response.data
  },
  delete: async (id, cancel = false) => {
    await api.request({
      url: `/notes/${id}`,
      method: "DELETE",
      signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
    })
  },
  update: async (note, cancel = false) => {
    const response = await api.request({
      url: `/notes/${note.id}`,
      method: "PUT",
      data: note,
      signal: cancel ? cancelApiObject[this.update.name].handleRequestCancellation().signal : undefined,
    })

    return response.data
  },
}

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(noteAPI)