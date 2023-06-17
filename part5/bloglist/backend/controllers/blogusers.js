const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const blogUser = require('../models/bloguser')

userRouter.get('/', async (request, response) => {
  const users = await blogUser
    .find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  response.json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({ error: 'Password required (min 3 characters)' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new blogUser({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = userRouter