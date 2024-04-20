import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Filter from "./Filter";
import PersonForm from "./PersonForm";
import Persons from "./Persons";
import Notification from "./Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchName, setSearchName] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    personsService.getAll().then((response) => setPersons(response));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (
      !persons
        .map((person) => person.name.toLocaleLowerCase())
        .includes(newName.toLocaleLowerCase())
    ) {
      const personToAdd = {
        name: newName,
        number: newNumber,
      };
      personsService.create(personToAdd).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setError(false);
        setMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setMessage(null);
        }, 4000);
      });
    } else {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const person = persons.find(
          (person) => person.name.toLowerCase() === newName.toLocaleLowerCase()
        );
        const updatedPerson = { ...person, name: newName, number: newNumber };
        personsService
          .update(person.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === returnedPerson.id ? returnedPerson : person
              )
            );
            setNewName("");
            setNewNumber("");
            setError(false);
            setMessage(`Modified ${returnedPerson.name}`);
            setTimeout(() => {
              setMessage(null);
            }, 4000);
          })
          .catch(() => {
            setError(true);
            setMessage(
              `Information of ${person.name} has already been removed from the server`
            );
            setTimeout(() => {
              setMessage(null);
            }, 4000);
          });
      }
    }
  };

  const handleDelete = (id) => {
    let personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService
        .remove(id)
        .then((response) => {
          setPersons(persons.filter((person) => person.id !== response.id));
        })
        .catch(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setError(true);
          setMessage(
            `Information of ${personToDelete.name} has already been removed from the server`
          );
          setTimeout(() => {
            setMessage(null);
          }, 4000);
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  );
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} error={error} />
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h2>Add a new person</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
