import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('<Blog /> tests', () => {
  let container

  const testPost = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'test url',
    likes: 0,
    user: {
      name: 'Test User',
      username: 'test',
      id: 'testId'
    }
  }

  const user = {
    id: 'testId'
  }

  const updatePost = jest.fn()

  beforeEach(() => {
    container = render(<Blog blog={testPost} updatePost={updatePost} user={user} />).container
  })

  test('blog displays only title by default', () => {
    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'Test Title'
    )
    expect(div).not.toHaveTextContent(
      'Test Author'
    )
    expect(div).not.toHaveTextContent(
      'test url'
    )
    expect(div).not.toHaveTextContent(
      'Likes'
    )
  })

  test('Blog details are shown after clicking View', async () => {
    const testUser = userEvent.setup()
    const button = screen.getByText('View')
    await testUser.click(button)

    const div = container.querySelector('.blog')
    expect(div).toHaveTextContent(
      'test url'
    )
    expect(div).toHaveTextContent(
      'Likes'
    )
  })

  test('Likes update handler called twice', async () => {
    const testUser = userEvent.setup()
    const viewButton = screen.getByText('View')
    await testUser.click(viewButton)
    const likeButton = screen.getByText('Like')
    await testUser.click(likeButton)
    await testUser.click(likeButton)

    expect(updatePost.mock.calls).toHaveLength(2)
  })

})

test('<BlogForm /> test', async () => {
  const addPost =jest.fn()
  const testUser = userEvent.setup()

  render(<BlogForm addPost={addPost} />)

  const title = screen.getByPlaceholderText('Insert title')
  const author = screen.getByPlaceholderText('Insert author')
  const url = screen.getByPlaceholderText('Insert URL')
  const addButton = screen.getByText('Add')

  await testUser.type(title, 'Test Title')
  await testUser.type(author, 'Test Author')
  await testUser.type(url, 'Test URL')
  await testUser.click(addButton)

  expect(addPost.mock.calls).toHaveLength(1)
  console.log(addPost.mock.calls[0][0])
  expect(addPost.mock.calls[0][0].title).toBe('Test Title')
  expect(addPost.mock.calls[0][0].author).toBe('Test Author')
  expect(addPost.mock.calls[0][0].url).toBe('Test URL')
})