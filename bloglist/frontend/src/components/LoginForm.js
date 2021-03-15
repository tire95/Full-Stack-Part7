import React from 'react'
import { connect } from 'react-redux'
import { login } from '../reducers/loginReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button, TextField } from '@material-ui/core'

const LoginForm = (props) => {

  const loginUser = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    event.target.username.value = ''
    event.target.password.value = ''
    props.login({
      username, password
    }, props.setNotification)
  }

  return (
    <div className='loginFormDiv'>
      <form onSubmit={loginUser}>
        <div>
          <TextField
            label='username'
            name='username'
          />
        </div>
        <div>
          <TextField
            label='password'
            type='password'
            name='password'
          />
        </div>
        <Button type='submit' variant='contained' color='primary' >Login</Button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  login, setNotification
}

const mapStateToProps = () => {
  return {
  }
}

const ConnectedLoginForm = connect(mapStateToProps, mapDispatchToProps)(LoginForm)


export default ConnectedLoginForm