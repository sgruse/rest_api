'use strict'

let express = require('express')
let app = express()
let apiRouter = express.Router()
let publicRouter = express.Router()
var url = require('url')
let bodyParser = require('body-parser')
let mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_LAB_URI || 'mongodb://localhost/db')

// Artist route
require('./routes/artists-route')(apiRouter)

// Songs route
require('./routes/songs-route')(apiRouter)

// Create User

app.use(bodyParser.json())
app.use('/', apiRouter, (req, res) => {

})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
