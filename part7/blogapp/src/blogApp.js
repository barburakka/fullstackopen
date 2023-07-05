import { useEffect, useContext } from 'react'
import { useQuery } from 'react-query'

import BlogLogin from './components/BlogLogin'
import Message from './components/Message'
import BlogUsers from './components/BlogUsers'
import BlogUser from './components/BlogUser'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import loginService from './services/login'

import {
  Routes,
  Route,
  Link
} from 'react-router-dom'

import { getBlogs, setToken } from './services/blogRequests'
import { useAlert } from './MessageContext'
import UserContext from './UserContext'

import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'

const App = () => {
  const [user, setUser] = useContext(UserContext)

  const showMessage = useAlert()

  const KEY = 'authBlogAppUser' // declared separate const as it is used several times

  const response = useQuery(
    'blogs',
    getBlogs, {
      retry: 1
    }
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(KEY)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser({ type: 'SET', payload: user })
      setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password
      })
      setUser({ type: 'SET', payload: user })
      window.localStorage.setItem(KEY, JSON.stringify(user))
      setToken(user.token)
      showMessage({ text: 'Successful login', type: 'success' })

    } catch (exception) {
      showMessage({ text: 'Wrong username or password', type: 'warning' })
    }}

  const logOut = () => {
    window.localStorage.removeItem(KEY)
    setToken(null)
    setUser({ type: 'CLEAR' })
    showMessage({ text: 'Logged out', type: 'success' })
  }

  if ( response.isLoading ) {
    return <div>loading data...</div>
  }

  if (response.isError) {
    return (
      <div>
        Server or network error
      </div>
    )
  }

  const blogs = response.data

  if (user === null) {
    return (
      <Container className='text-center'>
        <Row>
          <Col md={{ span: 3, offset: 4 }}>
            <h3>Blog App Login</h3>
            <Message />
            <BlogLogin handleLogin={handleLogin} />
          </Col>
        </Row>
      </Container>
    )
  } // login form extracted into separate component

  return (
    <Container>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand className="h1 mb-0">Blog App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="nav-link">Blogs</Link>
              <Link to="/users" className="nav-link">Users</Link>
            </Nav>
            <Navbar.Text className="justify-content-end">
                Signed in as: {user.username} &nbsp;
            </Navbar.Text>
            <Button variant="light" onClick={logOut} size="sm">Log out</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Message />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />
        <Route path="/users" element={<BlogUsers />} />
        <Route path="/users/:id" element={<BlogUser />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Container>
  )
}

export default App
