import React from 'react'
import { connect } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import { Button, TextField } from '@material-ui/core'

const BlogForm = (props) => {

  const addNew = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
      likes: event.target.likes.value || 0,
    }
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    event.target.likes.value = ''
    props.addBlog(newBlog)
    props.setNotification(`New blog '${newBlog.title}'`)
  }

  return (
    <div className='blogFormDiv'>
      <form onSubmit={addNew}>
        <div>
          <TextField
            label='title'
            name='title'
            id='titleInput'
          />
        </div>
        <div>
          <TextField
            label='author'
            name='author'
            id='authorInput'
          />
        </div>
        <div>
          <TextField
            label='url'
            name='url'
            id='urlInput'
          />
        </div>
        <div>
          <TextField
            type='number'
            label='likes'
            name='likes'
            id='likesInput'
          />
        </div>
        <Button type='submit' id='blogCreationButton' variant='contained' color='primary' >Add blog</Button>
      </form>
    </div>
  )
}

const mapDispatchToProps = {
  addBlog, setNotification
}

const mapStateToProps = () => {
  return {
  }
}

const ConnectedBlogForm = connect(mapStateToProps, mapDispatchToProps)(BlogForm)


export default ConnectedBlogForm