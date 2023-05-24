import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({ persons }) => {
  return ( 
    persons.map(person => 
      <div key={person.id}>
        {person.name} {person.number}
      </div>
    )
  )
}

const Filter = ( { filter, filterHook } ) => {
  
  const filterChange = (event) => {
    filterHook(event.target.value)
  }

  return (
    <div>
        Filter shown with <input value={filter} onChange={filterChange}/>
    </div>
  )
}

const PersonForm = ( { phonebook, addHook } ) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    
    const names = phonebook.map(person => person.name)
    
    if (names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber,
        id: phonebook.length + 1
      }
 
      addHook(phonebook.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <form>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
        </div>
        <div>
          <button type="submit" onClick={addPerson}>add</button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newFilter, setNewFilter] = useState('')

  const personsToShow = ( newFilter === '' )
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} filterHook={setNewFilter} />
      <h3>Add new</h3>
      <PersonForm phonebook={persons} addHook={setPersons} />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App