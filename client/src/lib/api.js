import axios from 'axios'
import { getToken, clearToken } from './auth'

const create = (baseURL) => {
  const client = axios.create({ baseURL })
  
  client.interceptors.request.use(cfg => {
    const token = getToken()
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`
    }
    return cfg
  })

  client.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        clearToken()
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }
  )
  
  return client
}

export const userApi = create(import.meta.env.VITE_USER_API || 'http://localhost:3000/api/users')
export const courseApi = create(import.meta.env.VITE_COURSE_API || 'http://localhost:3002')
export const enrollApi = create(import.meta.env.VITE_ENROLL_API || 'http://localhost:3003/api')
export const paymentApi = create(import.meta.env.VITE_PAYMENT_API || 'http://localhost:3004')