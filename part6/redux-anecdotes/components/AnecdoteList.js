import { useSelector, useDispatch } from 'react-redux'
import { saveAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/anecdoteNotificationReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()

  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return filter === ''
      ? anecdotes
      : anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()))
  })

  const vote = (id) => {
    dispatch(saveAnecdote(id))
    dispatch(setNotification(`You voted for '${anecdotes.find(n => n.id === id).content}'`, 5))
  }

  return (
    <div>
      {anecdotes.toSorted((a1, a2) => a2.votes - a1.votes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes} votes &nbsp;
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList