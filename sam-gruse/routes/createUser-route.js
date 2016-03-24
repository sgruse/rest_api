'use strict';

let User = require(__dirname + '/../models/createUser-model');

module.exports = (publicRouter) => {
  publicRouter.route('/createUser')
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data);
      let newUser = new User(req.body);
      let username = req.body.name;
      User.findOne({name: username}, (err, data) => {
        if (data) {
          console.log('Not a valid username')
          res.status(404)
          res.json({msg: 'Not a valid username'})
          res.end();
        }
        if (data == null) {
          newUser.save((err, user) => {
            if (err) {
              res.status(418);
              res.json({msg: 'User couldn\'t be saved'});
            };
            res.status(200);
            res.json(user);
            res.end();
          });
        };
      });
    });
  });
};
