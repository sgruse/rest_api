'use strict';

const mongoose = require('mongoose');

const artistsSchema = new mongoose.Schema({
  name: String,
  age: Number,
  dopenessFactor: Number,
  genre: String
});

module.exports = mongoose.model('Artists', artistsSchema);
