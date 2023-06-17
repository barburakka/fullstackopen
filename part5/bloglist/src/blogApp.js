import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('authBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'authBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setMessage({
        text: 'Wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }}

  const logOut = () => {
    window.localStorage.removeItem('authBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addPost = (newPost) => {
    blogService
      .create(newPost)
      .then(returnedPost => {
        setBlogs(blogs.concat(returnedPost))
        toggleVisibility()
        setMessage({
          text: `Added ${returnedPost.title} by ${returnedPost.author}`,
          type: 'success'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error => {
        if (error.response) {
          setMessage({
            text: error.response.data.error,
            type: 'error'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
      })
  }

  const updatePost = (id, updatedPost) => {
    blogService
      .update(id, updatedPost)
      .then(returnedPost => {
        setBlogs(blogs.map(blog => blog.id !== returnedPost.id ? blog : returnedPost)) // Delay on screen update?
      })
      .catch(error => {
        if (error.response) {
          setMessage({
            text: error.response.data.error,
            type: 'error'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }
      })
  }

  const removePost = (blog) => {
    if (window.confirm(`Do you really want to delete ${blog.title} by ${blog.author}?`)) {
      blogService
        .remove(blog.id)
        .then(() => {
          setBlogs(blogs.filter(post => post.id !== blog.id))
          setMessage({
            text: `Post ${blog.title} deleted`,
            type: 'success'
          })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          if (error.response) {
            setMessage({
              text: error.response.data.error,
              type: 'error'
            })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          }
        })
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Message message={message} />
        <form onSubmit={handleLogin}>
          <div>
            username &nbsp;
            <input
              type="text"
              id='username'
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password &nbsp;
            <input
              type="password"
              id='password'
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id='login-button'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>Blog List</h2>
      <Message message={message} />
      Logged in as &lsquo;{user.username}&rsquo;&nbsp;
      <button onClick={logOut}>Log out</button>
      <br></br>
      <br></br>

      {visible &&
        <div>
          <BlogForm addPost={addPost}/>
          <button onClick={toggleVisibility}>Hide</button>
        </div>
      }

      {!visible &&
        <button onClick={toggleVisibility}>New entry</button>
      }

      <div>
        <br></br>
        {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} updatePost={updatePost} removePost={removePost} user={user}/>
        )}
      </div>
    </div>
  )
}

export default App
