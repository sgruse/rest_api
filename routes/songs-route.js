'use strict';

// Schema/Models
let Songs = require(__dirname + '/../models/songs-model');

module.exports = (apiRouter) => {
  apiRouter.route('/songs')
  .get((req, res) => {
    Songs.find({}, (err, songs) => {
      console.log(songs);
      res.json(songs);
      res.end();
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data);
      var newSong = new Songs(req.body);
      // console.log(req.body);
      newSong.save((err, song) => {
        res.json(newSong);
        console.log('New song saved: ', newSong);
      });
    });
  });

  apiRouter.route('/songs/:id')
  .get((req, res) => {

  })
  .put((req, res) => {

  })
  .delete((req, res) => {
    Songs.findById(req.params.title, (err, song) => {
      song.remove((err, song) => {
        res.json({message: 'song removed'})
        res.end()
      });
    });
  });
};
