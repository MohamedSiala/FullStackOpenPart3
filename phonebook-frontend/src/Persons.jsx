import Person from "./Person";

const Persons = ({ personsToShow, handleDelete }) => {
  return (
    <div>
      {personsToShow.map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDelete={() => handleDelete(person.id)}
        />
      ))}
    </div>
  );
};

export default Persons;
