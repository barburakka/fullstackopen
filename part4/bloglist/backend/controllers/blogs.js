const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/bloguser')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(request.user)

  const newPost = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })

  const savedPost = await newPost.save()
  user.blogs = user.blogs.concat(savedPost._id)
  await user.save()
  response.status(201).json(savedPost)
})

blogRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'Unknown user' })
  }

  const user = await User.findById(request.user)
  const blog = await Blog.findById(request.params.id)

  if ( blog.user.toString() === user._id.toString() ) {
    await Blog.findByIdAndRemove(request.params.id)

    user.blogs = user.blogs.filter(blogid => blogid.toString() !== blog._id.toString() )
    await user.save()

    response.status(204).end()
  } else {
    return response.status(401).json({ error: 'Users can only delete their own posts' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const post = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const updatedPost = await Blog.findByIdAndUpdate(request.params.id, post, { new: true })
  response.json(updatedPost)
})

module.exports = blogRouter