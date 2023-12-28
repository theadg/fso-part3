const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI

mongoose
    .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })
    
const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

// Return _id as id
// Remove _id and __v
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema)

const hasExistingName = async (name) => {
    const person = await Person.find({ name: name });
    return person.length;
}

const store = async (request, response) => {
    const { body } = request
    const { name, number } = body

    if (!name || !number) {
        return response.status(400).json({
            error: 'incomplete fields'
        })
    }

    if (await hasExistingName(name)){
        return response.status(400).json({error: 'Name Already Exists'})
    }

    const person = await Person.create({
        name,
        number
    })

    return response.json(person)
}

const index = async (request, response) => {
    const persons = await Person.find()

    return response.json(persons)
}


module.exports = {
    personSchema,
    store,
    index
}


