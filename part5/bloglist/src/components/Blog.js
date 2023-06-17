import { useState } from 'react'

const Blog = ({ blog, updatePost, removePost, user }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const updateLikes = () => {
    updatePost(blog.id, {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const postStyle = {
    padding: 5,
    borderBottomStyle: 'dotted',
    borderWidth: 1
  }

  return (
    <div style={postStyle} className='blog'>
      {!visible &&
        <div>
          {blog.title} &nbsp;
          <button onClick={toggleVisibility}>View</button>
        </div>
      }

      {visible &&
        <div>
          <b>{blog.title}</b> <i>by {blog.author}</i>&nbsp;
          <button onClick={toggleVisibility}>Hide</button><br></br>
          {blog.url}<br></br>
          Likes: {blog.likes}&nbsp;
          <button onClick={updateLikes}>Like</button> <br></br>
          { blog.user.name && <i>Created by {blog.user.name}&nbsp;</i> }
          { ( blog.user.id === user.id ) && <button onClick={() => removePost(blog)}>Delete</button> }
        </div>
      }
    </div>
  )
}

export default Blog
