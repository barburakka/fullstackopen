import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useState } from 'react'
import axios from 'axios'

import AnecdoteForm from './components/queryAnecdoteForm'
import Notification from './components/queryNotification'

import MessageContext from './anecdoteContext'

const App = () => {
  const queryClient = useQueryClient()
  const [message, setMessage] = useState(null)

  const updateAnecdoteMutation = useMutation(
    (updatedAnecdote) => axios.put(`http://localhost:3001/anecdotes/${updatedAnecdote.id}`, updatedAnecdote).then(res => res.data),
    {
      onSuccess: (updatedAnecdote) => {
        queryClient.invalidateQueries('anecdotes')
        setMessage(`Voted '${updatedAnecdote.content}'`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      },
    })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery(
    'anecdotes',
    () => axios.get('http://localhost:3001/anecdotes').then(res => res.data)
  )

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <div>anecdotes not available due to server error</div>
  }

  const anecdotes = result.data

  return (
    <MessageContext.Provider value={[message, setMessage]}>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </MessageContext.Provider>
  )
}

export default App