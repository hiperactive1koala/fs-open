import { useEffect, useState } from 'react'
import service from './Services/person'
import { Persons } from './Components/Persons'
import { PersonForm } from './Components/PersonForm'
import { Filter } from './Components/Filter'


const Notification = ({ message, className }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={className}>{message}</div>
  )
}

const App = () => {

  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [notificationMessage, setnotificationMessage] = useState(null)
  const [isError, setIsError] = useState(true)

  useEffect(() => {
    service.getAll().then(initialData => {
      setPersons(initialData)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    const isExist =
      persons.filter(person => person.name == name).length > 0

    if (isExist) {
      const person = persons.filter(person => person.name === name)[0]
      const changedPerson = { ...person, number: number }
      const id = person.id
      if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
        service.changeNumber(id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === id ? returnedPerson : person))
          })
      }
    } else {
      const newPerson = { name: name, number: number }
      service.createPerson(newPerson).then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setnotificationMessage(`Added ${returnedPerson.name}`)
        setIsError(false)
      })
    }
    setName('')
    setNumber('')
    setTimeout(() => {
      setnotificationMessage(null)
    }, 5000);
  }

  const handleDelete = (id) => {
    const selectedName = persons.find(person => person.id === id).name
    if (window.confirm(`Delete ${selectedName}?`)) {
      service
        .deletePerson(id)
        .catch(error => {
          setnotificationMessage(`Information of ${selectedName} has already been removed from server`)
          setIsError(true)
        }
        )
      setPersons(persons.filter(person => id !== person.id))
      setTimeout(() => {
        setnotificationMessage(null)
      }, 5000);
    }
  }
  const handleFilter = (event) => { setFilter(event.target.value) }

  const handleName = (event) => { setName(event.target.value) }

  const handleNumber = (event) => { setNumber(event.target.value) }

  const filteredList = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} className={isError ? 'error' : 'success'} />
      <Filter filter={filter} handleFilter={handleFilter} />
      <h3>Add a new</h3>
      <PersonForm
        handleSubmit={handleSubmit}
        handleName={handleName}
        handleNumber={handleNumber}
        name={name}
        number={number} />
      <h2>Numbers</h2>
      {filteredList.map(person => <Persons key={person.id} name={person.name} number={person.number} onClick={() => handleDelete(person.id)} />)}
    </div>
  )
}

export default App