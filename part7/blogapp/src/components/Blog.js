import { useContext, useState } from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'

import { updateBlog, removeBlog, postComment } from '../services/blogRequests'
import { useAlert } from '../MessageContext'
import UserContext from '../UserContext'


import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'

const Blog = () => {
  const [comment, setComment] = useState('')

  const id = useParams().id
  const queryClient = useQueryClient()
  const blogs = queryClient.getQueryData('blogs')
  const blog = blogs.find(blog => blog.id === id)

  const [user] = useContext(UserContext)

  const navigate = useNavigate()

  const allowDelete = user && blog.user.username===user.username

  const showMessage = useAlert()

  const updateBlogMutation = useMutation(updateBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
  })

  const updateLikes = () => {
    updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1, user: blog.user.id })
  }

  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      navigate('/')
      showMessage({ text: `Post '${blog.title}' deleted`, type: 'success' })
    },
    onError: (error) => {
      showMessage({ text: error.response.data.error, type: 'error' })
    }
  })

  const removePost = () => {
    if (window.confirm(`Do you really want to delete '${blog.title}' by ${blog.author}?`)) {
      removeBlogMutation.mutate(blog.id)
    }
  }

  const addCommentMutation = useMutation(postComment, {
    onSuccess: (updatedPost) => {
      const updatedBlogs = blogs.map(post => post.id !== updatedPost.id ? post : updatedPost)
      queryClient.setQueryData('blogs', updatedBlogs)
    },
  })

  const addComment = (event) => {
    event.preventDefault()
    addCommentMutation.mutate({ comment, id })
    setComment('')
  }

  return (
    <Container>
      <h4>{blog.title} by <i>{blog.author}</i></h4>
      <div>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>Likes: {blog.likes}&nbsp;<Button variant="primary" onClick={updateLikes} size="sm">Like</Button></div>
        { blog.user.name && <i>Created by {blog.user.name}&nbsp;</i> }
        { allowDelete && <Button variant="warning" onClick={() => removePost()} size="sm">Delete</Button> }
        <br></br>
        <br></br>
        <div><b>Comments</b></div>
        <Form onSubmit={addComment}>
          <InputGroup>
            <Form.Control
              type="text"
              id='comment'
              value={comment}
              name="Comment"
              placeholder='add new comment...'
              onChange={({ target }) => setComment(target.value)}
            />
            <Button variant="secondary" type="submit" id='add-commnet-button'>Add comment</Button>
          </InputGroup>
        </Form>
        <ListGroup as="ul">
          {blog.comments && blog.comments.map(comment =>
            <ListGroup.Item as="li" key={Math.random().toString(16).slice(2)}>{comment}</ListGroup.Item>)}
        </ListGroup>
      </div>
    </Container>
  )
}

export default Blog
