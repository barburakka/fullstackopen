const express = require('express')
const morgan = require('morgan')

morgan.token('data', function (req, res) { 
  dataString = JSON.stringify(req.body)
  if (dataString !== '{}') {
    return dataString
    }
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const requestTime = new Date()
    const responseText = `<div>Phonebook has info for ${persons.length} people</div><p>${requestTime.toUTCString()}</p>`
    response.send( responseText )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(note => note.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(note => note.id !== id)
  
    response.status(204).end()
})

const generateId = () => {
  let randomId = Math.floor(Math.random() * 1000 )
  while (persons.find(person => person.id === randomId)) {
    randomId = Math.floor(Math.random() * 1000 )
  }
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'Name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'Number missing' 
    })
  }

  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'Name already exists' 
    })
  }
  
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)