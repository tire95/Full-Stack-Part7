const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'NOTIFICATION': {
      return action.data
    }
    case 'CLEAR_NOTIFICATION': {
      return ''
    }
    default:
      return state
  }
}

export const setNotification = (message) => {
  return {
    type: 'NOTIFICATION',
    data: {
      message
    }
  }
}

export const clearNotification = () => {
  return {
    type: 'CLEAR_NOTIFICATION'
  }
}

export default notificationReducer