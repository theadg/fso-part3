const mongoose = require('mongoose')

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URI

console.log("URL HERE HELLO?", url)

mongoose
    .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number:{
        type: String,
        validate: {
            validator: function(value) {
                return /\d{2,3}-\d{5,9}/.test(value);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
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
    const person = await Person.findOne({ name: name });

    return person;
}

const store = async (request, response, next) => {
    const { body } = request
    const { name, number } = body

    // if (!name || !number) {
    //     return response.status(400).json({
    //         error: 'incomplete fields'
    //     })
    // }

    try {
        const existingPerson = await hasExistingName(name)

        if (existingPerson){
            existingPerson.number = number
            existingPerson.save();

            return response.json(existingPerson)
        }

        const newPerson = new Person({
            name,
            number
        })

        console.log('ubamot here before save')
        await newPerson.save()

        return response.json(newPerson)
    } catch (err) {
        console.log('ubamot here err')

        return next(err)
    }
    
}

const index = async (request, response, next) => {
    try {
        const persons = await Person.find()

        return response.json(persons)
    } catch (err) {
        next(err)
    }
}

const update = async (request, response, next) => {
    const { body } = request
    const { name, number } = body

    if (!name || !number) {
        return response.status(400).json({
            error: 'incomplete fields'
        })
    }

    const person = {
        name,
        number
    }

    try {
        const updatedPerson = await Person.findByIdAndUpdate(
            request.params.id,
            person,
            { 
                new: true,
                runValidators: true
            }
        )
        
        response.json(updatedPerson)
    } catch (err){
        next(err)
    }
};

const show = async (request, response, next) => {
    try {
        const person = await Person.findById(request.params.id)

        return response.json(person);
    } catch (err) {
        next(err)
    }
}
module.exports = {
    personSchema,
    store,
    index,
    update,
    show
}


