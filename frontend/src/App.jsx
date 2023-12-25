import { useEffect, useState } from 'react'
import peopleService from './service/people'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import UserMessage from './components/UserMessage'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    peopleService
      .getAll()
      .then(persons => {
          setPersons(persons);
      })
  }, []);

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [newMessage, setNewMessage] = useState('');
  const [isError, setIsError] = useState(false);


  const handleFilterChange = (event) => {
    setFilter(event.target.value);

  }

  const resetShowMessage = () => {
    setTimeout(() => {
      setNewMessage('')
    }, 5000);
  }

  useEffect(()=> {
    const handleFilter = (filter) => {
      return persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) 
                        || person.number.includes(filter.toLowerCase()))
    }

    setFilteredPersons(handleFilter(filter));
  }, [filter, persons])

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (!checkNameExists(personObject)){
      setPersons([...persons, personObject]);
      setNewName('');
      setNewNumber('');

      peopleService
        .create(personObject)
        .then(response => {
          setNewMessage(`Added ${response.name}`);

          resetShowMessage();
        })
    } else {
      handleUpdate(newName, personObject);
    }

  }

  const handleUpdate = (name, newObject) => {
    const currentPerson = persons.find(person => person.name === name);

    if (confirm(`${name} is already added to the phonebook, replace the old number with a new one?`)){
      peopleService
        .update(currentPerson.id, newObject)
        .then(res => {
          setPersons(persons.map(person => person.id !== currentPerson.id ? person : res))

          setNewMessage(`Updated ${res.name}`);

          setTimeout(() => {
            setNewMessage('')
          }, 5000);
        })
        .catch(err => {
          setIsError(true);
          setNewMessage(
            `Information of ${name} has already been removed from the server`,
            false
          )
          
          // resetShowMessage();
        })
    }
  }

  const checkNameExists = (newPerson) => {
    return persons.some((person) => person.name === newPerson.name);
  }

  const handleDelete = (id, name) => {
    if (confirm(`Delete ${name}`)){
      peopleService
        .deleteUser(id)
        .then(
          setPersons(persons.filter(person => person.id !== id))
        )
    } 
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <UserMessage 
        message={newMessage} 
        isError={isError}
      />
      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange} 
      />
      <h3>Add a New</h3>
      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <h2>Numbers</h2>
      <Persons 
        filteredPersons={filteredPersons}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App