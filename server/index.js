const app = require('express')()

const server = require('http').Server(app)

const PORT = process.env.PORT || 3000

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

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`ready at http://localhost:${PORT}`)
  })
})