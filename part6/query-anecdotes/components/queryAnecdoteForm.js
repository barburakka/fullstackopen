import { useMutation, useQueryClient } from 'react-query'
import { useContext } from 'react'
import axios from 'axios'

import MessageContext from '../anecdoteContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const [message, setMessage] = useContext(MessageContext)

  const newAnecdoteMutation = useMutation(
    (newAnecdote) => axios.post('http://localhost:3001/anecdotes', newAnecdote).then(res => res.data),
    {
      onSuccess: (newAnecdote) => {
        queryClient.invalidateQueries('anecdotes')
        setMessage(`'${newAnecdote.content}' created`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      },
      onError: () => {
        setMessage('Anecdote too short, must be at least 5 characters')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  )

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm