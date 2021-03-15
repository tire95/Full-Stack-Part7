import loginService from '../services/login'
import { setToken } from '../services/blogs'

const reducer = (state = null, action) => {
  switch (action.type) {
    case 'LOGIN': {
      const user = action.data
      return user
    }
    case 'LOGOUT': {
      return null
    }
    default:
      return state
  }
}

export const login = (content, setNotification) => {
  return async dispatch => {
    try {
      const user = await loginService.login(content)
      setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      dispatch({
        type: 'LOGIN',
        data: user,
      })
      setNotification('Logged in')
    } catch (exception) {
      setNotification(`Login failed: ${exception}`)
    }
  }
}

export const logout = () => {
  return async dispatch => {
    setToken(null)
    window.localStorage.clear()
    dispatch({
      type: 'LOGOUT',
    })
  }
}

export default reducer