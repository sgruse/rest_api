'use strict'

// Schema/Models
let Songs = require(__dirname + '/../models/songs-model');

module.exports = (apiRouter) => {
  apiRouter.route('/songs')
  .get((req, res) => {
    Songs.find({}, (err, songs) => {
      res.type('json')
      res.status(200)
      res.json(songs)
      res.end()
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      var newSong = new Songs(req.body)
      newSong.save((err, song) => {
        res.type('json')
        res.json(newSong)
        res.status(200)
        console.log('New song saved: ', newSong)
      })
    })
  })

  apiRouter.route('/songs/:id')
  .get((req, res) => {
    Songs.findById(req.params.id, (err, song) => {
      res.type('json')
      res.json(song)
      res.status(200)
  })
})
  .put((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
    Songs.update({_id: req.params.id}, req.body, (err, song) => {
      if(err) return res.send(err)
      res.type('json')
      res.json(song)
      res.status(200)
    })
  })
})
  .delete((req, res) => {
    Songs.findById(req.params.id, (err, song) => {
      song.remove((err, song) => {
        res.type('json')
        res.json({message: 'song removed'})
        res.status(200)
        res.end()
      })
    })
  })

  apiRouter.route('/mostPopArtist')
    .get((req, res) => {
      var artistArray = []
      Songs.find({}, (err, songs) => {
        songs.map(function(songs) {
          return songs.artist
        }).forEach(function(artist) {
          artistArray.push(artist)
        })
        function mostCommon(artistArray) {
          var count = {}
          var most
          for (var i = 0; i < artistArray.length; i++) {
            count[artistArray[i]] = count[artistArray[i]] + 1 || 1
            if(count[artistArray[i]] > count[most] || 0) most = artistArray[i]
          }
          console.log('The artist who has the most songs in the database is ' + most + ' who had ' + count[most] + ' songs')
          res.json('The artist who has the most songs in the database is ' + most + ' who had ' + count[most] + ' songs')
          res.status(200)
          return [most, count[most]]
        }
        mostCommon(artistArray)
      })
    })
}
