const express = require("express")
var morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()

morgan.token("data", function (req) {
  if (Object.keys(req.body).length !== 0) {
    return JSON.stringify(req.body)
  }
  return " "
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)
const Person = require("./models/person")
app.use(express.static("dist"))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    let entries = persons.length
    let date = new Date()
    response.send(`Phonebook has info for ${entries} people <br /> ${date}`)
  })
})

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    })
  }
  Person.find({})
    .then((persons) => {
      if (
        persons
          .map((person) => person.name.toLocaleLowerCase())
          .includes(body.name.toLocaleLowerCase())
      ) {
        return response.status(400).json({
          error: "name must be unique",
        })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })

        person
          .save()
          .then((savedPerson) => response.json(savedPerson))
          .catch((error) => next(error))
      }
    })
    .catch((error) => next(error))
})

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
