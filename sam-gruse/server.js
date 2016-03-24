'use strict'

let express = require('express')
let app = express()
let apiRouter = express.Router()
let publicRouter = express.Router()
let loginRouter = express.Router()

let auth = require('./lib/authorization')
var url = require('url')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_LAB_URI || 'mongodb://localhost/db')

// Artist route
require('./routes/artists-route')(apiRouter)

// Songs route
require('./routes/songs-route')(apiRouter)

// Create User route
require('./routes/createUser-route')(publicRouter)

// Login verification
require('./routes/login-route')(loginRouter)

app.use(bodyParser.json())
app.use('/api', auth, apiRouter) 
app.use('/public', publicRouter)
app.use('/login', loginRouter)

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
