import { createContext, useReducer, useContext } from 'react'

const messageReducer = (state, action) => {
  switch (action.type) {
  case 'SHOW':
    return action.payload
  case 'CLEAR':
    return null
  default:
    return state
  }
}

const MessageContext = createContext()

export const MessageContextProvider = (props) => {
  const [message, dispatch] = useReducer(messageReducer, null)

  return (
    <MessageContext.Provider value={[message, dispatch] }>
      {props.children}
    </MessageContext.Provider>
  )
}

export const useMessageText = () => {
  const [message] = useContext(MessageContext)
  return message
}

export const useAlert = () => {
  const valueAndDispatch = useContext(MessageContext)
  const dispatch = valueAndDispatch[1]
  return (payload) => {
    dispatch({ type: 'SHOW', payload })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5000)
  }
}

export default MessageContext