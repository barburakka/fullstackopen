import { useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import { createBlog } from '../services/blogRequests'
import { useAlert } from '../MessageContext'

import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

const BlogForm = ( { formToggle } ) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const queryClient = useQueryClient()
  const showMessage = useAlert()

  const blogMutation = useMutation(createBlog, {
    onSuccess: (returnedPost) => {
      queryClient.invalidateQueries('blogs')
      formToggle()
      showMessage({ text: `Added '${returnedPost.title}' by ${returnedPost.author}`, type: 'success' })
    },
    onError: (error) => {
      showMessage({ text: error.response.data.error, type: 'error' })
    }
  })

  const addBlog = (event) => {
    event.preventDefault()
    blogMutation.mutate({ title, author, url })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <Form onSubmit={addBlog}>
        <InputGroup className="mb-3">
          <InputGroup.Text id="titleLabel">Title</InputGroup.Text>
          <Form.Control
            placeholder="Insert title"
            aria-label="Title"
            aria-describedby="Blog title"
            id='title'
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="authorLabel">Author</InputGroup.Text>
          <Form.Control
            aria-label="Auhtor"
            aria-describedby="Blog author"
            id="author"
            value={author}
            name="Author"
            placeholder="Insert author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </InputGroup>
        <InputGroup className="mb-3">
          <InputGroup.Text id="urlLabel">URL</InputGroup.Text>
          <Form.Control
            aria-label="URL"
            aria-describedby="Blog url"
            id='url'
            value={url}
            name="URL"
            placeholder='Insert URL'
            onChange={({ target }) => setURL(target.value)}
          />
        </InputGroup>
        <Button variant="primary" type="submit" id='add-button' className='me-2'>Add</Button>
        <Button variant="secondary" onClick={formToggle} id='hide-button'>Hide</Button>
      </Form>
    </div>
  )
}

export default BlogForm