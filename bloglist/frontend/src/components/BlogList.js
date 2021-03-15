import React, { useRef } from 'react'
import { useSelector, connect } from 'react-redux'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import { Table } from '@material-ui/core'
import { Button } from '@material-ui/core'

const Blog = ({ user, blog, handleLike, handleDelete }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 10,
    border: 'solid',
    borderLeftColor: 'green',
    borderLeftWidth: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5
  }

  if (user.username === blog.user.username) {
    return (
      <div style={blogStyle} className='blog'>
        <i>{blog.title}</i> by {blog.author}
        <Togglable buttonLabel='Show'>
          <p>{blog.url}</p>
          <p>{blog.likes} <Button variant='outlined' color='primary' onClick={handleLike}>Like</Button></p>
          <p><Button variant='outlined' color='secondary' onClick={handleDelete}>Delete</Button></p>
        </Togglable>
      </div>
    )
  } else {
    return (
      <div style={blogStyle} className='blog'>
        <i>{blog.title}</i> by {blog.author}
        <Togglable buttonLabel='Show'>
          <p>{blog.url}</p>
          <p>{blog.likes} <Button variant='outlined' color='primary' onClick={handleLike}>Like</Button></p>
        </Togglable>
      </div>
    )
  }
}

const Blogs = (props) => {
  const blogFormRef = useRef()
  const user = props.login
  const blogs = useSelector(state => state.blogs)

  if (user) {
    return (
      <div>
        <h2>Blogs</h2>
        <Table striped>
          <tbody>
            {blogs.map(blog =>
              <Blog
                user={user}
                key={blog.id}
                blog={blog}
                handleLike={() => {
                  props.likeBlog(blog.id, {
                    author: blog.author,
                    title: blog.title,
                    url: blog.url,
                    likes: blog.likes + 1
                  })
                  props.setNotification(`Liked '${blog.title}'`)
                }}
                handleDelete={() => {
                  props.deleteBlog(blog.id)
                  props.setNotification(`Deleted '${blog.title}'`)
                }}
              />
            )}
          </tbody>
        </Table>
        <Togglable buttonLabel='Add a new blog' ref={blogFormRef}>
          <BlogForm />
        </Togglable>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

const mapDispatchToProps = {
  likeBlog, deleteBlog, setNotification
}

const mapStateToProps = (state) => {
  return {
    login: state.login
  }
}

const ConnectedBlogs = connect(mapStateToProps, mapDispatchToProps)(Blogs)


export default ConnectedBlogs