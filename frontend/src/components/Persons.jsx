const Persons = ({ filteredPersons, handleDelete }) => {
  return (
    <div>
    {filteredPersons.map(({ id, name, number }) => (
      <div key={id}>
        <p>{name} {number}</p>
        <button onClick={() => handleDelete(id ,name)}>Delete</button>
      </div>
      )
    )}
    </div>
  )
}

export default Persons