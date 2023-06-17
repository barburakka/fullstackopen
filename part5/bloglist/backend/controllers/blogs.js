const blogRouter = require('express').Router()
const Blog = require('../models/blog')
//const User = require('../models/bloguser')

const { userExtractor } = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'operation not permitted' })
  }

  const newPost = new Blog({
    title,
    author,
    url,
    likes: likes ? likes : 0,
    user: user._id
  })

  const savedPost = await newPost.save()
  user.blogs = user.blogs.concat(savedPost._id)
  await user.save()
  await newPost.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedPost)
})

blogRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if (!user) {
    return response.status(401).json({ error: 'Only authorised users can delete posts' })
  }

  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'Users can only delete the posts they created' })
  }

  user.blogs = user.blogs.filter(blogid => blogid.toString() !== blog._id.toString() )
  await user.save()
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { title, url, author, likes, user } = request.body
  const updatedPost = await Blog.findByIdAndUpdate(request.params.id,  { title, url, author, likes, user }, { new: true } )
  await updatedPost.populate('user', { username: 1, name: 1 })
  response.json(updatedPost)
})

module.exports = blogRouter