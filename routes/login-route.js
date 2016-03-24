'use strict';

let jwt = require('jsonwebtoken');
let User = require(__dirname + '/../models/createUser-model');

module.exports = (loginRouter) => {
  loginRouter.route('/login')
    .post((req, res) => {
      let authorizationArray = req.headers.authorization.split(' ');
      let method = authorizationArray[0];
      let base64ed = authorizationArray[1];
      let authArray = new Buffer(base64ed, 'base64').toString().split(':');
      let name = authArray[0];
      let password = authArray[1];

      User.findOne({name: name}, (err, user) => {
        let valid = user.compareHash(password)
        if (!valid) {
          return res.json({status: 'failure'});
        };
        var genToken = user.generateToken();
        console.log('Your Token Is : ', genToken);
        res.json({token: genToken});
        res.status(200);
        res.end();
      });
    });
  };
