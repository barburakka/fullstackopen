import { useQuery } from '@apollo/client'

import { FAV_GENRE } from '../libraryQueries'

const Recommendations = () => {
  const result = useQuery(FAV_GENRE,
    {
      onError: (error) => {
        console.log(error.graphQLErrors[0].message)
      }
    }
  )

  if (result.loading) {
    return (
      <div>loading...</div>
    )
  }

  const books = result.data.recommendBooks
  const favoriteGenre = result.data.me.favoriteGenre

  return (
    <div>
      <h4>Books in your favourite genre <b>{favoriteGenre}</b></h4>

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

export default Recommendations