const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const compareTwoBlogs = (blog1, blog2) => {
    return blog1.likes > blog2.likes ? blog1 : blog2
  }

  const dummyBlog = {
    title: 'dummy',
    author: 'dummy',
    url: 'dummy',
    likes: 0
  }

  return blogs.reduce((favoriteBlog, blog) => compareTwoBlogs(blog, favoriteBlog), dummyBlog)
}

const mostBlogs = (blogs) => {
  const authorAndCount = blogs.reduce((list, blog) => {
    list[blog.author] = list[blog.author] + 1 || 1
    return list
  }, {})
  var authorWithMostBlogs
  var blogCount = 0
  blogs.forEach(blog => {
    if (authorAndCount[blog.author] > blogCount) {
      authorWithMostBlogs = blog.author
      blogCount = authorAndCount[blog.author]
    }
  })
  return { author: authorWithMostBlogs, blogs: blogCount }
}

const mostLikes = (blogs) => {
  const authorAndCount = blogs.reduce((list, blog) => {
    list[blog.author] = list[blog.author] + blog.likes || blog.likes
    return list
  }, {})
  var authorWithMostLikes
  var likesCount = 0
  blogs.forEach(blog => {
    if (authorAndCount[blog.author] > likesCount) {
      authorWithMostLikes = blog.author
      likesCount = authorAndCount[blog.author]
    }
  })
  return { author: authorWithMostLikes, likes: likesCount }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}