'use strict'

const mongoose = require('mongoose')

const artistsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  dopenessFactor: Number,
  genre: String,
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Songs'
  }]
})

module.exports = mongoose.model('Artists', artistsSchema)
