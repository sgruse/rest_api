'use strict';

const mongoose = require('mongoose');

const songsSchema = new mongoose.Schema({
  title: String,
  artist: String,
  dopenessFactor: Number,
  genre: String
});

module.exports = mongoose.model('Songs', songsSchema);
