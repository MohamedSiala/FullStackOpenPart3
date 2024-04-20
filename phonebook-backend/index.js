const express = require("express");
var morgan = require("morgan");
const cors = require("cors");

morgan.token("data", function (req, res) {
  if (Object.keys(req.body).length !== 0) {
    return JSON.stringify(req.body);
  }
  return " ";
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
);

app.use(express.static("dist"));
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  let newId = Math.floor(Math.random() * 10000) + 1;
  while (persons.map((person) => person.id).includes(newId)) {
    newId = Math.floor(Math.random() * 10000) + 1;
  }
  return newId;
};
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  let entries = persons.length;
  let date = new Date();
  response.send(`Phonebook has info for ${entries} people <br /> ${date}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personToDelete = persons.find((person) => person.id === id);
  persons = persons.filter((person) => person.id !== id);
  response.json(personToDelete);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  if (
    persons
      .map((person) => person.name.toLocaleLowerCase())
      .includes(body.name.toLocaleLowerCase())
  ) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
