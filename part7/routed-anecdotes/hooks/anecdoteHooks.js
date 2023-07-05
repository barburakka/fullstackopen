import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  window.addEventListener('reset', reset)

  return {
    type,
    value,
    onChange
  }
}

export const useAnotherHook = () => {
  // ...
}