const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://phonebook-root:${password}@cluster0.k2c6eop.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

const store = async () => {
    const person = await Person.create({
        name,
        number
    })

    console.log(`added ${person.name} number ${person.number} to phonebook`);

    mongoose.connection.close()
}

const index = async () => {
    const persons = await Person.find()

    persons.map(({name, number}) => {
        console.log(`${name} ${number}`)
    })

    mongoose.connection.close()
}

if (process.argv.length === 3) {
    index()
}

if (process.argv.length === 5){
    store();
}

