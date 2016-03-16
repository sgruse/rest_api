'use strict';

// Schema/Models
let Artists = require(__dirname + '/../models/artists-model');

module.exports = (apiRouter) => {
  apiRouter.route('/artists')
  .get((req, res) => {

  })
  .post((req, res) => {

  });

  apiRouter.route('/artists/:id')
  .get((req, res) => {

  })
  .put((req, res) => {

  })
  .delete((req, res) => {

  });
};
