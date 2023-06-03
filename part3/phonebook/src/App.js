import { useState, useEffect } from 'react'
import comms from './services/comms'

const Notification = ({ message }) => {
  if (!message) {
    return
  }
  
  const style = {
    color: message.type==='error' ? 'red' : 'green',
    background: 'lightgrey',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  }

  return (
    <div style={style}>
      {message.text}
    </div>
  )
}

const Persons = ({ phonebook, filterText, updateHook, messageHook }) => {
  
  const personsToShow = ( filterText === '' )
    ? phonebook
    : phonebook.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  const deletePerson = (id) => {
    const name = phonebook.find(n => n.id === id).name

    if (window.confirm(`Do you really want to delete ${name}?`)) {
      comms
        .remove(id)
        .then( () => {
          updateHook(phonebook.filter(n => n.id !== id))
          messageHook( {
            text: `${name} deleted!`,
            type: 'success'
          })
          setTimeout(() => {
            messageHook(null)
          }, 5000)
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

const PersonForm = ( { phonebook, updateHook, messageHook } ) => {
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
        alert(`${newName} is already added to phonebook, replace current number with the new number?`)
        const record = phonebook.find(n => n.name === newName)
        const newRecord = { ...record, number: newNumber }
        const newRecordId = newRecord.id
        comms
          .update(newRecordId, newRecord)
          .then(returnedRecord => {
            updateHook(phonebook.map(record => record.id !== newRecordId ? record : returnedRecord))
            messageHook( {
              text: `${newRecord.number} added for ${newRecord.name}`,
              type: 'success' 
            })
            setTimeout(() => {
              messageHook(null)
            }, 5000)
          })
          .catch( () => {
            messageHook( {
              tex: `'${newRecord.name}' was already removed from the phonebook`,
              type: 'error'
            })
            setTimeout(() => {
              messageHook(null)
            }, 5000)
            updateHook(phonebook.filter(record => record.id !== newRecordId))
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
          messageHook( {
            text: `${personObject.name} added`,
            type: 'success'
          })
          setTimeout(() => {
            messageHook(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          messageHook( {
            text: error.response.data.error,
            type: 'error'
          })
          setTimeout(() => {
            messageHook(null)
          }, 5000)
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
  const [message, setMessage] = useState(null)

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
      <PersonForm phonebook={persons} updateHook={setPersons} messageHook={setMessage} />
      <Notification message={message} />
      <h3>Numbers</h3>
      <Persons phonebook={persons} filterText={newFilter} updateHook={setPersons} messageHook={setMessage} />
    </div>
  )
}

export default App