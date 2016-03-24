'use strict'

let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/createUser-model');
require('dotenv').load();

module.exports = (req, res, next) => {
  var decoded;
  try {
    var token = req.headers.authorization.split(' ')[1];
    decoded = jwt.verify(token, process.env.SECRET);
  }
  catch (e) {
    return res.status(404);
    res.json({msg: 'You\'re not authorized to recieve this information'});
  };
  User.findOne({_id: decoded._id})
  .then(user => {
    req.user = user;
    next();
  })
  .catch(err => {
    res.status(404);
    res.json({msg: err})
    next();
  });
};
