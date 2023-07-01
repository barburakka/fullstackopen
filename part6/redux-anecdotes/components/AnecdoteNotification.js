import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(({ notification }) => {
    return notification
  })

  if (notification === '') {
    return
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 20
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification