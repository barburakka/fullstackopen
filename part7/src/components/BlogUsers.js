import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'

import { getUsers } from '../services/blogRequests'

import Container from 'react-bootstrap/Container'
import ListGroup from 'react-bootstrap/ListGroup'
import Badge from 'react-bootstrap/Badge'

const BlogUsers = () => {
  const response = useQuery(
    'users',
    getUsers,
    {
      retry: 1
    }
  )

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

  const users = response.data

  return (
    <Container>
      <h4>Users</h4>
      <ListGroup>
        {users.map(user =>
          <ListGroup.Item action as="li" key={user.id} className="d-flex justify-content-between align-items-start">
            <Link to={`/users/${user.id}`} className='nav-link'>{user.name}</Link>
            <Badge bg="secondary" pill>
              {user.blogs.length}
            </Badge>
          </ListGroup.Item>)}
      </ListGroup>
    </Container>
  )
}

export default BlogUsers