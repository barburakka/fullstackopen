import { useParams } from 'react-router-dom'
import { useQueryClient } from 'react-query'

import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'

const BlogUser = () => {
  const id = useParams().id
  const queryClient = useQueryClient()
  const users = queryClient.getQueryData('users')

  if (!users) {
    return (
      <div>user list not loaded</div>
    )
  }

  const user = users.find(u => u.id === id)

  return (
    <Container>
      <h4>{user.name}</h4>
      <b>Added blogs:</b>
      <ListGroup>
        {user.blogs.map(blog =>
          <ListGroup.Item key={blog.id}>{blog.title}</ListGroup.Item>)}
      </ListGroup>
    </Container>
  )
}

export default BlogUser