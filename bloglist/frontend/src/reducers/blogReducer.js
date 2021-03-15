import blogService from '../services/blogs'

const reducer = (state = [], action) => {
  switch (action.type) {
    case 'LIKE': {
      const likedBlog = action.data
      return state.map(blog =>
        blog.id !== likedBlog.id ? blog : { ...blog, likes: likedBlog.likes })
        .sort((a, b) => b.likes - a.likes)
    }
    case 'ADD': {
      const data = action.data
      return state.concat(data).sort((a, b) => b.likes - a.likes)
    }
    case 'INIT_BLOGS': {
      return action.data
    }
    case 'DELETE': {
      return state.filter(blog => blog.id !== action.data)
    }
    default:
      return state
  }
}

export const addBlog = (content) => {
  return async dispatch => {
    const newBlog = await blogService.addNew(content)
    dispatch({
      type: 'ADD',
      data: newBlog,
    })
  }
}

export const likeBlog = (id, blog) => {
  return async dispatch => {
    await blogService.update(id, blog)
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs.sort((a, b) => b.likes - a.likes),
    })
  }
}

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.deleteBlog(id)
    dispatch({
      type: 'DELETE',
      data: id
    })
  }

}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs.sort((a, b) => b.likes - a.likes),
    })
  }
}

export default reducer