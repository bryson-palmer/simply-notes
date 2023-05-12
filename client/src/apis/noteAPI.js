import { api } from "./configs/axiosConfigs"
import { defineCancelApiObject } from "./configs/axiosUtils"

export const noteAPI = {
  get: async (id, cancel = false) => {
    const response = await api.request({
      url: `/notes/${id}`,
      method: "GET",
      // retrieving the signal value by using the property name
      signal: cancel ? cancelApiObject[this.get.name].handleRequestCancellation().signal : undefined,
    })

    // returning the note returned by the API
    return response.data.note
  },
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/notes/",
      method: "GET",
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    })

    return response.data.notes
  },
  search: async (title, cancel = false) => {
    const response = await api.request({
      url: "/notes/search",
      method: "GET",
      params: {
        title: title,
      },
      signal: cancel ? cancelApiObject[this.search.name].handleRequestCancellation().signal : undefined,
    })

    return response.data.notes
  },
  create: async (note, cancel = false) => {
    await api.request({
      url: `/notes/`,
      method: "POST",
      data: note,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })
  },
  delete: async (id, cancel = false) => {
    await api.request({
      url: `/notes/${id}`,
      method: "DELETE",
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })
  },
  deleteAll: async (cancel = false) => {
    await api.request({
      url: `/notes/`,
      method: "DELETE",
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })
  },
  update: async (id, note, cancel = false) => {
    await api.request({
      url: `/notes/${id}`,
      method: "PUT",
      data: note,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })
  },
}

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(noteAPI)