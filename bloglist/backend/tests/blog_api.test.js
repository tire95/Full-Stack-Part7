const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
var token


beforeAll(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('testtest', 10)
  const user = new User({ username: 'test', passwordHash })

  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'test',
      password: 'testtest'
    })

  token = loginResponse.body.token
})


beforeEach(async () => {
  await Blog.deleteMany({})

  for (let blog of helper.initialBlogs) {

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blog)
  }

})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('right amount of blogs is returned', async () => {
    const result = await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`)
    expect(result.body).toHaveLength(helper.initialBlogs.length)
  })

  test('unique identifier is named properly', async () => {
    const result = await api
      .get('/api/blogs')
      .set('Authorization', `bearer ${token}`)

    expect(result.body[0].id).toBeDefined()
  })
})

describe('creating a new blog', () => {

  test('adds to the db if blog is valid', async () => {
    const newBlog = {
      title: 'Debugging Node.js is a pain in the ass',
      author: 'Mr X',
      url: 'www.AAA.com',
      likes: 666
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(n => n.title)
    expect(titles).toContain(
      'Debugging Node.js is a pain in the ass'
    )
  })

  test('missing likes defaults to 0', async () => {
    await Blog.deleteMany({})

    const newBlog = {
      title: 'Debugging Node.js is a pain in the ass',
      author: 'Mr X',
      url: 'www.AAA.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs').set('Authorization', `bearer ${token}`)

    expect(response.body[0].likes).toEqual(0)
  })

  test('fails if title is missing', async () => {
    const newBlog = {
      author: 'Mr X',
      url: 'www.AAA.com'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails if url is missing', async () => {
    const newBlog = {
      author: 'Mr X',
      title: 'Debugging Node.js is a pain in the ass'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status code 401 if token is wrong', async () => {
    const newBlog = {
      title: 'Debugging Node.js is a pain in the ass',
      author: 'Mr X',
      url: 'www.AAA.com',
      likes: 666
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer wrongtoken')
      .send(newBlog)
      .expect(401)
  })
})

describe('deletion of a blog', () => {

  test('succeeds if id is valid', async () => {
    const blogs = await helper.blogsInDb()

    const blogToDelete = blogs[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )
  })

  test('fails if id is invalid', async () => {

    await api
      .delete(`/api/blogs/${1}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400)
  })
})

describe('updating an existing blog', () => {
  test('succeeds if id is valid and likes are edited', async () => {
    const blogs = await helper.blogsInDb()

    const blogToEdit = blogs[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 10
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(updatedBlog.likes).toEqual(10)
  })

  test('succeeds if id is valid and title is edited', async () => {
    const blogs = await helper.blogsInDb()

    const blogToEdit = blogs[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'React patterns updated',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(updatedBlog.title).toEqual('React patterns updated')
  })

  test('succeeds if id is valid and author is edited', async () => {
    const blogs = await helper.blogsInDb()

    const blogToEdit = blogs[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'React patterns',
        author: 'Michael Chan Junior',
        url: 'https://reactpatterns.com/',
        likes: 7
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(updatedBlog.author).toEqual('Michael Chan Junior')
  })

  test('succeeds if id is valid and url is edited', async () => {
    const blogs = await helper.blogsInDb()

    const blogToEdit = blogs[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.fi/',
        likes: 7
      })
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()

    const updatedBlog = blogsAtEnd[0]

    expect(updatedBlog.url).toEqual('https://reactpatterns.fi/')
  })

  test('fails if id is invalid', async () => {

    await api
      .put(`/api/blogs/${2}`)
      .set('Authorization', `bearer ${token}`)
      .send({
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.fi/',
        likes: 7
      })
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})