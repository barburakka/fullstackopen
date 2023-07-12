import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { useNavigate, Navigate } from 'react-router-dom'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommendations from './components/Recommendations'
import Login from './components/Login'

import { BOOK_ADDED, BOOKS } from './libraryQueries'

import {
  Routes,
  Route,
  Link
} from 'react-router-dom'

const App = () => {
  const [token, setToken] = useState(null)

  const client = useApolloClient()
  const navigate = useNavigate()

  useEffect(() => {
    const savedToken = window.localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      alert(`New book '${data.data.bookAdded.title}' added`)
      client.cache.updateQuery({ query: BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(data.data.bookAdded),
        }
      })
    }
  })

  const padding = {
    padding: 3
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.clearStore()
    navigate('/login')
  }

  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" />
    }
    return children
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">authors</Link>
        <Link style={padding} to="/books">books</Link>
        { !token && <Link style={padding} to="/login">login</Link> }
        { token && <Link style={padding} to="/add">add book</Link> }
        { token && <Link style={padding} to="/recommend">recommend</Link> }
        { token && <button onClick={logout}>logout</button> }
      </div>
      <Routes>
        <Route path="/" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={
          <ProtectedRoute>
            <NewBook />
          </ProtectedRoute> } />
        <Route path="/recommend" element={
          <ProtectedRoute>
            <Recommendations />
          </ProtectedRoute> } />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App