const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const { Note, store, index } = require('./models/person')

const app = express()

// const Note
app.use(cors())

/**
 * @Middleware
 * -> takes in JSON data of request
 * -> transforms JSON data to a JS Object
 * -> attaches it to request
 */
app.use(express.json())

/**
 * @Middleware
 * -> makes express show static content
 * -> "static content" = dist folder (contains minified files)
 * -> essentially, 
 */
app.use(express.static('dist'))

morgan.token('body', (request, response) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = process.env.PORT || 3001

let phonebook = [
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

app.get('/info', (request,response) => {
    const numberOfPeople = phonebook.length
    const date = new Date()

    return response.send(`
        <p>Phonebook has info for ${numberOfPeople} people</p>
        <br/>
        <p>${date}</p>
    `)
})

app.get('/api/persons', index)

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (!person) {
        return response.status(404).end()
    }

    return response.json(person)
})

const generateRandomId = () => {
    return Math.floor(Math.random() * 1000);
}

const hasExistingName = (name) => {
    return phonebook.find(person => person.name === name)
}

// app.post('/api/persons', (request, response) => {
//     const body = request.body;
    
//     if (!body.name || !body.number){
//         return response.status(400).json({error: 'Incomplete details'})
//     }
//     const nameExists = hasExistingName(body.name)

//     if (nameExists) {
//         return response.status(400).json({error: 'Name already exists'})
//     }

//     const person = {
//         id: generateRandomId(),
//         name: body.name,
//         number: body.number
//     }

//     phonebook = phonebook.concat(person)

//     return response.json(person).status(201)
// });

app.post('/api/persons', store);

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)

    if (!person) {
        return response.status(404).end()
    }

    phonebook = phonebook.filter(person => person.id !== id)

    return response.status(204).end() 
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})