const { GraphQLError } = require('graphql')
const { groupBy } = require('lodash')

const Author = require('./models/author')
const Book = require('./models/book')
const bookUser = require('./models/bookuser')

const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre) {
        return Book.find({}).populate('author', { name: 1, born: 1 })
      }
      if (args.author && !args.genre) {
        const author = await Author.find({ name: args.author })
        return Book.find({ author: author[0]._id }).populate('author', { name: 1, born: 1 })
      }
      if (!args.author && args.genre) {
        return Book.find({ genres: args.genre }).populate('author', { name: 1, born: 1 })
      }
      if (args.author && args.genre) {
        const author = await Author.find({ name: args.author })
        return Book.find({ author: author[0]._id, genres: args.genre }).populate('author', { name: 1, born: 1 })
      }
    },
    allAuthors: async () => {
      const books = await Book.find({}).populate('author', { name: 1 })
      const booksByAuthor = groupBy(books, (book) => book.author.name)
      const authorBookCount = Object.entries(booksByAuthor).reduce((array, [name, bookList]) => {
        return array.concat({
          name,
          bookCount: bookList.length
        })
      }, [])

      const authors = await Author.find({})

      const authorsWithCount = authors.map(a => ({ name: a.name, born: a.born, id: a._id, bookCount: authorBookCount.find(ab => ab.name === a.name) && authorBookCount.find(ab => ab.name === a.name).bookCount }) )
      return authorsWithCount
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    recommendBooks: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authorised', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      return Book.find({ genres: currentUser.favoriteGenre }).populate('author', { name: 1, born: 1 })
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authorised', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.find({ name: args.author })

      if (!author[0]) {
        const newAuthor = new Author({ name: args.author })
        try {
          await newAuthor.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
        const newBook = new Book({ ...args, author: newAuthor })
        try {
          await newBook.save()
        } catch (error) {
          throw new GraphQLError('Saving book failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.title,
              error
            }
          })
        }
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
        return newBook
      }

      const newBook = new Book({ ...args, author: author[0] })
      try {
        await newBook.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
      return newBook
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.find({ name: args.name })
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authorised', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      if (!author[0]) {
        return null
      }

      const updatedAuthor = await Author.findByIdAndUpdate(author[0]._id, { name: author[0].name, born: args.setBornTo }, { new: true } )
      return updatedAuthor
    },
    createUser: async (root, args) => {
      const user = new bookUser({ username: args.username, favoriteGenre: args.favoriteGenre })
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await bookUser.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
}

module.exports = resolvers