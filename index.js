const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const { store, index, update, show } = require('./models/person')

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
 */
app.use(express.static('dist'))

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

app.use(
    morgan(
        ':method :url :status :res[content-length] - :response-time ms :body'
    )
)

const PORT = process.env.PORT || 3001

let phonebook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456',
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523',
    },
    {
        id: 3,
        name: 'Dan Abramov',
        number: '12-43-234345',
    },
    {
        id: 4,
        name: 'Mary Poppendieck',
        number: '39-23-6423122',
    },
]

app.get('/info', (request, response) => {
    const numberOfPeople = phonebook.length
    const date = new Date()

    return response.send(`
        <p>Phonebook has info for ${numberOfPeople} people</p>
        <br/>
        <p>${date}</p>
    `)
})

app.get('/api/persons', index)

app.get('/api/persons/:id', show)

app.post('/api/persons', store)

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find((person) => person.id === id)

    if (!person) {
        return response.status(404).end()
    }

    phonebook = phonebook.filter((person) => person.id !== id)

    return response.status(204).end()
})

app.put('/api/persons/:id', update)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// Custom Express Error Middleware
const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
