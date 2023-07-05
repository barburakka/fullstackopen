import { useState } from 'react'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

const BlogLogin = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Control
          type="text"
          id='username'
          value={username}
          name="Username"
          autoComplete="username"
          placeholder="Enter Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formPassword">
        <Form.Control
          type="password"
          id='password'
          value={password}
          name="Password"
          autoComplete="password"
          placeholder="Enter Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" id='login-button'>Login</Button>
    </Form>
  )
}

export default BlogLogin