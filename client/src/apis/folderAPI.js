import { api } from "./configs/axiosConfigs"
import { defineCancelApiObject } from "./configs/axiosUtils"

export const folderAPI = {
  getAll: async (cancel = false) => {
    const response = await api.request({
      url: "/folders",
      method: "GET",
      signal: cancel ? cancelApiObject[this.getAll.name].handleRequestCancellation().signal : undefined,
    })

    return response.data
  },
  create: async (folder, cancel = false) => {
    const response = await api.request({
      url: `/folders`,
      method: "POST",
      data: folder,
      signal: cancel ? cancelApiObject[this.create.name].handleRequestCancellation().signal : undefined,
    })

    return response.data
  },
  delete: async (id, cancel = false) => {
    await api.request({
      url: `/folders/${id}`,
      method: "DELETE",
      signal: cancel ? cancelApiObject[this.delete.name].handleRequestCancellation().signal : undefined,
    })
  },
}

// defining the cancel API object for ProductAPI
const cancelApiObject = defineCancelApiObject(folderAPI)