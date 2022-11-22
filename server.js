const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const toyService = require('./services/toy.service')

const app = express()
const http = require('http').createServer(app)

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

const port = process.env.PORT || 3031

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3031',
    'http://127.0.0.1:3031',
  ],
  credentials: true,
}
app.use(cors(corsOptions))

// Express Routing:

// LIST
app.get('/api/toy', (req, res) => {
  var { name, label, sort, inStock } = req.query

  const filterBy = {
    name: name || '',
    label: label || 'All',
    sort: sort || 'name',
    inStock: JSON.parse(inStock),
  }
  toyService.query(filterBy).then((toys) => {
    res.send(toys)
  })
})

// READ
app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.getById(toyId).then((toy) => {
    res.send(toy)
  })
})

// ADD
app.post('/api/toy', (req, res) => {
  const { name, price, inStock, createdAt, labels, reviews } = req.body
  const toy = {
    name,
    price,
    inStock,
    createdAt,
    labels,
    reviews,
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})
// UPDATE
app.put('/api/toy/:toyId', (req, res) => {
  const { name, price, _id, inStock, createdAt, labels, reviews } = req.body

  const toy = {
    _id,
    name,
    price,
    inStock,
    createdAt,
    labels,
    reviews,
  }
  toyService.save(toy).then((savedToy) => {
    res.send(savedToy)
  })
})

// DELETE
app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService.remove(toyId).then(() => {
    res.send('Removed!')
  })
})

// LOGIN
app.post('/login', (req, res) => {
  console.log('req.body:', req.body)
  res.cookie('user', req.body)
  res.send('logging  in')
})
app.post('/logout', (req, res) => {
  res.clearCookie('loggedInUser')
  res.clearCookie('user')
  res.send('logging  uot')
})

http.listen(port, () =>
  console.log(`Server listening on port http://127.0.0.1:/${port}`)
)
