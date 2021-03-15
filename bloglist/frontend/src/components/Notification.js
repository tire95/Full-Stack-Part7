
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { clearNotification } from '../reducers/notificationReducer'
import { Alert } from '@material-ui/lab'

const Notification = (props) => {
  const notification = props.notification

  useEffect(() => {
    const timer = setTimeout(() => props.clearNotification(), (5000))
    return () => clearTimeout(timer)
  }, [props, notification])



  if (notification) {
    return (
      <Alert severity='info'>
        {notification.message}
      </Alert>
    )
  } else {
    return (
      <div></div>
    )
  }
}

const mapDispatchToProps = {
  clearNotification
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  }
}

const ConnectedNotification = connect(mapStateToProps, mapDispatchToProps)(Notification)
export default ConnectedNotification