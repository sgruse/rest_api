'use strict'

let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/createUser-model');
require('dotenv').load();

module.exports = (req, res, next) => {
  var decoded;
  try {
    var token = req.headers.authorization.split(' ')[1];
    decoded = jwt.verify(token, process.env.SECRET);
    User.findOne({_id: decoded._id}, (err, user) => {
      if (err) {
        res.json({msg: err})
      }
      req.user = user;
      next();
    })
  }
  catch (e) {
    res.status(404);
    res.json({msg: 'You\'re not authorized to recieve this information'});
  };
};
