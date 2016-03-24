'use strict';

let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcrypt');
require('dotenv').load();

let usersSchema = mongoose.Schema({
  name: String,
  password: String
})

usersSchema.pre('save', function (next) {

  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  next();
});

usersSchema.methods.compareHash = function (password) {
  return bcrypt.compareSync(password, this.password)
};

usersSchema.methods.generateToken = function () {
  return jwt.sign({_id: this._id}, process.env.SECRET)
};

let Users = mongoose.model('Users', usersSchema);
module.exports = Users;
