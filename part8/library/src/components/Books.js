import { useQuery } from '@apollo/client'
const { uniq } = require('lodash')
import { useState } from 'react'

import { BOOKS, BOOKS_BY_GENRE } from '../libraryQueries'

const Books = () => {
  const [filter,setFilter] = useState(null)

  const result = filter ? useQuery(BOOKS_BY_GENRE, {
    variables: { genreToSearch: filter }
  }) : useQuery(BOOKS)

  if (result.loading) {
    return (
      <div>loading...</div>
    )
  }

  const books = result.data.allBooks
  const genres = filter ? [filter] : uniq( books.map(b => b.genres).flat() )

  const genreSelect = (event) => {
    setFilter(event.target.id)
  }

  const resetFilter = () => {
    setFilter(null)
  }

  // const booksToShow = filter ? books.filter(b => b.genres.includes(filter)) : books

  return (
    <div>
      <h2>Books</h2>
      <div>
        {genres.map((g) => <button key={g} id={g} onClick={genreSelect}>{g}</button>)}
        <button key='reset' id='rest' onClick={resetFilter}>all</button>
      </div>
      { filter && <h4>Books in genre <b>{filter}</b>:</h4>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books