import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newFilter, setNewFilter] = useState('')

  const personsToShow = ( newFilter === '' )
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

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