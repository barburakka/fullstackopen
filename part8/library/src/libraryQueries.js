import { gql } from '@apollo/client'

export const AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
  }
}
`
export const BOOKS = gql`
query {
  allBooks {
    title
    author {
      name
    }
    published
    genres
  }
}
`

export const ADD_BOOK = gql`
mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author {
      name
      born
      id
    }
    published
    genres
    id
  }
}
`

export const UPDATE_AUTHOR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(
    name: $name,
    setBornTo: $setBornTo,
  ) {
    name
    born
    id
  }
}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const FAV_GENRE = gql`
query {
  recommendBooks {
    title
    author {
      name
    }
    published
  }
  me {
    favoriteGenre
  }
}
`

export const BOOKS_BY_GENRE = gql`
query findBookByGenre($genreToSearch: String) {
  allBooks(genre: $genreToSearch) {
    title
    author {
      name
    }
    published
  }
}
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      author {
        name
        born
        id
      }
      published
      genres
      id
    }
  }
`