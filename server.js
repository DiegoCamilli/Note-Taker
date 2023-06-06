const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

// this is where the Middleware lives
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// made the path to the db.json file
const dbPath = path.join(__dirname, './db/db.json')

// Set up get routes
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, './public/index.html'))
)

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, './public/notes.html'))
)

app.get('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const notes = JSON.parse(data)
    res.json(notes)
  })
})

// Set up post routs 
app.post('/api/notes', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const notes = JSON.parse(data)
    const newNote = { ...req.body, id: Math.floor(Math.random() * 10000000) }
    notes.push(newNote)

    fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Internal Server Error' })
      }

      res.json(notes)
    })
  })
})

// Set up delete rout
app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id

  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Internal Server Error' })
    }

    const notes = JSON.parse(data)
    const noteIndex = notes.findIndex((note) => note.id === parseInt(noteId))

    if (noteIndex !== -1) {
      notes.splice(noteIndex, 1)

      fs.writeFile(dbPath, JSON.stringify(notes), (err) => {
        if (err) {
          console.error(err)
          return res.status(500).json({ error: 'Internal Server Error' })
        }

        res.json(notes)
      })
    } else {
      res.status(404).send(`Note with ID ${noteId} not found`)
    }
  })
})

// The msg when the user uses npm start
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
)