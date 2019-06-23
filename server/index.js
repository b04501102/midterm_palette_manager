const app = require('express')()

const server = require('http').Server(app)
const io = require('socket.io')(server)

const mongoose = require('mongoose')

const mongoDB = process.env.NODE_DEV !== 'production' ? 'mongodb://rainforest:abcd1234@rainforest.tools:32768/admin' : 'mongodb://rainforest:abcd1234@192.168.0.143:32768/admin'

const PORT = process.env.PORT || 8080

const dev = process.env.NODE_DEV !== 'production'
const next = require('next')
const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

const bodyParser = require('body-parser')

nextApp.prepare().then(() => {
  // Allows for cross origin domain request:
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  
  app.use('/api/palettes', require('./api/palettes'))

  mongoose.Promise = Promise
  mongoose.connect(mongoDB, { 
    useNewUrlParser: true 
  })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
  })
})