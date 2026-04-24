const ACCESS_TOKEN_KEY = 'tc_access_token'
const REFRESH_TOKEN_KEY = 'tc_refresh_token'
const USER_KEY = 'tc_user'

export const getToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setToken = (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token)

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const saveUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user))

export const getSavedUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const isTokenPresent = () => !!getToken()
