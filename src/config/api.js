import axios from "axios"

const prodURL = "http://4.228.3.200:4000"
const devURL = "http://localhost:4000"

const baseURL = prodURL

const api = axios.create({
  baseURL
})

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  }
)

api.interceptors.response.use(response => response, async function (error) {
  if (error.response.status === 401) {
    localStorage.removeItem("token")
  }
  return Promise.reject(error)
})

export default api

export const api_external = axios.create({
  baseURL
})