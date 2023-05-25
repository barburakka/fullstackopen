import { useState, useEffect } from 'react'
import comms from './services/comms'

const Persons = ({ phonebook, filterText, updateHook }) => {
  
  const personsToShow = ( filterText === '' )
    ? phonebook
    : phonebook.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  const deletePerson = (id) => {
    const name = phonebook.find(n => n.id === id).name

    if (window.confirm(`Do you really want to delete ${name}?`)) {
      comms
        .remove(id)
        .then(response => {
          updateHook(phonebook.filter(n => n.id !== id))
      })
    }
  }

  return ( 
    personsToShow.map(person => 
      <div key={person.id}>
        {person.name} {person.number}
        &nbsp;
        <button onClick={() => deletePerson(person.id)}>Delete</button>
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
        Filter shown with <input id="filtertInput" value={filter} onChange={filterChange}/>
    </div>
  )
}

const PersonForm = ( { phonebook, updateHook } ) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    
    const names = phonebook.map(person => person.name)
    
    if (names.includes(newName)) {
      if ( phonebook.find(n => n.name === newName).number === newNumber ) {
        alert(`${newName} is already added to phonebook`)
        setNewName('')
        setNewNumber('')
      }
      else {
        alert(`${newName} is already added to phonebook, replace the existing number with the new number?`)
        const record = phonebook.find(n => n.name === newName)
        const newRecord = { ...record, number: newNumber }
        const newRecordId = newRecord.id
        comms
          .update(newRecordId, newRecord)
          .then(returnedRecord => {
            updateHook(phonebook.map(record => record.id !== newRecordId ? record : returnedRecord))
          })
        setNewName('')
        setNewNumber('')
      }
    }
    else {
      const personObject = {
        name: newName,
        number: newNumber
      }
 
      comms
        .create(personObject)
        .then(response => {
          updateHook(phonebook.concat(response))
          setNewName('')
          setNewNumber('')
      })
    }
  }

  return (
    <form>
        <div>
          name: <input id= "nameInput" value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          number: <input id="numberInput" value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
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

  useEffect(() => {
    comms
      .retrieve()
      .then(response => {
        setPersons(response)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={newFilter} filterHook={setNewFilter} />
      <h3>Add new</h3>
      <PersonForm phonebook={persons} updateHook={setPersons} />
      <h3>Numbers</h3>
      <Persons phonebook={persons} filterText={newFilter} updateHook={setPersons} />
    </div>
  )
}

export default App