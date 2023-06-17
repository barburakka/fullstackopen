import PropTypes from 'prop-types'

const Message = ({ message }) => {
  Message.PropTypes = {
    message: PropTypes.array.isRequired
  }

  if (!message) {
    return
  }

  const style = {
    color: message.type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    padding: 5,
    margin: 10
  }

  return (
    <div style={style} className='message'>
      {message.text}
    </div>
  )
}

export default Message
