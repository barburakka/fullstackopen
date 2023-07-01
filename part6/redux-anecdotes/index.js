import React from 'react'
import ReactDOM from 'react-dom/client'
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import App from './anecdoteApp'
import anecdoteReducer from './reducers/anecdoteReducer'
import anecdoteFilterReducer from './reducers/anecdoteFilterReducer'

const reducer = combineReducers({
  anecdotes: anecdoteReducer,
  filter: anecdoteFilterReducer
})

const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)