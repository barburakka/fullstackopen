import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { AUTHORS, UPDATE_AUTHOR } from '../libraryQueries'

const Authors = () => {
  const [name, setName] = useState('')
  const [birthyear, setBirthyear] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: AUTHORS } ],
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({  variables: { name: name.value, setBornTo: Number(birthyear) } })

    setName('')
    setBirthyear('')
  }

  const result = useQuery(AUTHORS)

  if (result.loading) {
    return (
      <div>loading...</div>
    )
  }

  const authors = result.data.allAuthors

  const options = authors.map(a => a = { value: a.name, label: a.name })

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br></br>

      <h4>Set birthyear</h4>
      <form onSubmit={submit}>
        <div>
          <Select options={options} onChange={setName}/>
        </div>
        <div>
          born
          <input
            type="number"
            value={birthyear}
            onChange={({ target }) => setBirthyear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors