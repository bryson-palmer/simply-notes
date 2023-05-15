// Configs taken from this article https://semaphoreci.com/blog/api-layer-react
import axios from "axios"

export const api = axios.create({
  // Set to true if cross-site Access-Control requests should be made using credentials
  withCredentials: false,
  // Replace with backend host url when it gets hosted somewhere
  baseURL: "http://localhost:3500",
  timeout: 1000
})

// defining a custom error handler for all APIs
const errorHandler = (error) => {
  const statusCode = error.response?.status

  // logging only errors that are not 401
  if (statusCode && statusCode !== 401) {
    console.error(error)
  }

  return Promise.reject(error)
}

// registering the custom error handler to the
// "api" axios instance
api.interceptors.response.use(undefined, (error) => {
  return errorHandler(error)
})