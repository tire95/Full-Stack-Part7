import React, { useEffect } from 'react'
import Blogs from './components/BlogList'
import Users from './components/UserList'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import { initializeBlogs } from './reducers/blogReducer'
import { getUsers } from './reducers/userReducer'
import { useDispatch, connect, useSelector } from 'react-redux'
import { logout } from './reducers/loginReducer'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'
import { Button, AppBar, Toolbar, Container } from '@material-ui/core'

const App = (props) => {
  const user = props.login
  const users = useSelector(state => state.users)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(getUsers())
  }, [dispatch])

  if (user === null) {
    return (
      <div className="container">
        <Notification />
        <h2>Log in to application</h2>
        <Togglable buttonLabel='Login'>
          <LoginForm />
        </Togglable>
      </div>
    )
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/users">Users</Button>
          <Button color="inherit" component={Link} to="/blogs">Blogs</Button>
          <Button variant='contained' color='secondary' onClick={props.logout} >Logout</Button>
        </Toolbar>
      </AppBar>
      <Notification />
      <div>
        <Switch>
          <Route path="/users">
            <Users users={users} />
          </Route>
          <Route path="/blogs">
            <Blogs />
          </Route>
        </Switch>
      </div>

    </Container>)
}

const mapDispatchToProps = {
  initializeBlogs, logout
}

const mapStateToProps = (state) => {
  return {
    login: state.login
  }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)


export default ConnectedApp