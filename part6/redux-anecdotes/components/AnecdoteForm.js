import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/anecdoteNotificationReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const [newAnecdote, setNewAnecdote] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    dispatch(createAnecdote(newAnecdote))
    dispatch(setNotification(`New anecdote '${newAnecdote}' saved`, 5))
    setNewAnecdote('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            value={newAnecdote}
            onChange={event => setNewAnecdote(event.target.value)}
            placeholder='Write new anecdote here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm