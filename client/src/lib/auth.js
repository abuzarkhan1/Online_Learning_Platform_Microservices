export const getToken = () => localStorage.getItem('token') || ''
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

export const getUserFromToken = () => {
  const token = getToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role
    }
  } catch (error) {
    console.error('Error parsing token:', error)
    return null
  }
}

export const isTokenExpired = () => {
  const token = getToken()
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return Date.now() >= payload.exp * 1000
  } catch (error) {
    return true
  }
}