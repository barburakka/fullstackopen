const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../blogapp')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/bloguser')

let authHeader

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
]

describe('blog posting tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)

    await User.deleteMany({})
    const user = { username: 'test', password: 'testpwd' }
    await api.post('/api/users').send(user)
    const response = await api.post('/api/login').send(user)
    authHeader = `Bearer ${response.body.token}`
  })

  test('all blogs are there', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('blogs have a field labelled id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('blogs can be posted', async () => {
    const testPost = {
      title: "Test Title",
      author: "Test Author",
      url: "test url",
      likes: 3
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testPost)
      .expect(201)

    const blogs = await api.get('/api/blogs')
    const titles = blogs.body.map(n => n.title)
    expect(titles).toContain(
      'Test Title'
    )
  })

  test('likes default to 0', async () => {
    const testPost = {
      title: "Post Not Liked",
      author: "Test Author",
      url: "test url"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testPost)
      .expect(201)

    expect(response.body.likes).toBe(0)
  })

  test('post with missing title not accepted', async () => {
    const testPost = {
      author: "Test Author",
      url: "test url"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testPost)
      .expect(400)
  })

  test('post can be deleted', async () => {
    const testPost = {
      title: "Test delete post",
      author: "Test Author",
      url: "test url"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testPost)
      .expect(201)

    const postToDelete = response.body

    await api
      .delete(`/api/blogs/${postToDelete.id}`)
      .set('Authorization', authHeader)
      .expect(204)

    const newBlogs = await api.get('/api/blogs')

    const titles = newBlogs.body.map(p => p.title)
    expect(titles).not.toContain(testPost.title)
  })

  test('deleting without proper token not authorised', async () => {
    const testPost = {
      title: "Post delete without token",
      author: "Test Author",
      url: "test url"
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', authHeader)
      .send(testPost)
      .expect(201)

    const postToDelete = response.body

    await api
      .delete(`/api/blogs/${postToDelete.id}`)
      .expect(401)
  })

  test('updating likes', async () => {
    const blogs = await api.get('/api/blogs')
    const postToUpdate = blogs.body[0]

    const updatedPost = {
      title: postToUpdate.title,
      author: postToUpdate.author,
      url: postToUpdate.url,
      likes: postToUpdate.likes + 1,
      id: postToUpdate.id
    }

    const resultPost = await api
      .put(`/api/blogs/${postToUpdate.id}`)
      .send(updatedPost)
      .expect(200)

    expect(resultPost.body).toEqual(updatedPost)
  })
})

describe('blog user tests', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({ username: 'test', password: 'testpwd'})
    await user.save()
  })

  test('duplicate usernames not allowed', async () => {
    const newUser = {
      username: 'test',
      password: 'testpwd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('expected `username` to be unique')
  })

  test('usernames must not be short', async () => {
    const newUser = {
      username: 't',
      password: 'testpwd',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('is shorter than the minimum allowed length')
  })

  test('password must be min 3 charachters', async () => {
    const newUser = {
      username: 'test',
      password: 't',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('min 3 characters')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})