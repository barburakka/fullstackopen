import { useState } from 'react'

const BlogForm = ({ addPost }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    addPost({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={addBlog}>
        <div>
          Title &nbsp;
          <input
            type="text"
            id='title'
            value={title}
            name="Title"
            placeholder='Insert title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          Author &nbsp;
          <input
            type="text"
            id='author'
            value={author}
            name="Author"
            placeholder='Insert author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          URL &nbsp;
          <input
            type="text"
            id='url'
            value={url}
            name="URL"
            placeholder='Insert URL'
            onChange={({ target }) => setURL(target.value)}
          />
        </div>
        <button type="submit" id='add-button'>Add</button>
      </form>
    </div>
  )
}

export default BlogForm