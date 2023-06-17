const testRouter = require('express').Router()
const Blog = require('../models/blog')
const blogUser = require('../models/bloguser')

testRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await blogUser.deleteMany({})

  response.status(204).end()
})

module.exports = testRouter