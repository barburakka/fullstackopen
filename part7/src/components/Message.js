import { useMessageText } from '../MessageContext'

import Alert from 'react-bootstrap/Alert'

const Message = () => {
  const message = useMessageText()

  if (!message) {
    return
  }

  return (
    <Alert key={message.type} variant={message.type}>
      {message.text}
    </Alert>
  )
}

export default Message
