import { useState } from 'react'
import { Link } from 'react-router-dom'

import BlogForm from './BlogForm'

import Button from 'react-bootstrap/Button'
import ListGroup from 'react-bootstrap/ListGroup'

const BlogList = ({ blogs }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      {visible &&
      <div>
        <h4>Add new entry</h4>
        <BlogForm formToggle={toggleVisibility} />
      </div>
      }

      {!visible &&
        <Button variant="secondary" onClick={toggleVisibility} className="mb-3">New entry</Button>
      }

      <br></br>
      <ListGroup>
        {blogs.toSorted((a, b) => b.likes - a.likes).map(blog =>
          <ListGroup.Item action as="li" key={blog.id}>
            <Link to={`/blogs/${blog.id}`} className='nav-link'>{blog.title}&nbsp;<i>{blog.author}</i></Link>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )

}

export default BlogList