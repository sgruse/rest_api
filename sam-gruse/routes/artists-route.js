'use strict'

// Schema/Models
let Artists = require(__dirname + '/../models/artists-model');

module.exports = (apiRouter) => {
  apiRouter.route('/artists')
  .get((req, res) => {
    Artists.find({}).populate('songs').exec((err, artist) => {
      res.type('json')
      res.json(artist)
      res.status(200)
    })
  })
  .post((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      var newArtist = new Artists(req.body)
      newArtist.save((err, artist) => {
        res.type('json')
        res.json(artist)
        res.status(200)
      })
    })
  })

  apiRouter.route('/artists/:id')
  .get((req, res) => {
    Artists.findById(req.params.id, (err, artist) => {
      res.type('json')
      res.json(artist)
      res.status(200)
    })
  })
  .put((req, res) => {
    req.on('data', (data) => {
      req.body = JSON.parse(data)
      Artists.update({_id: req.params.id}, req.body, (err, artist) => {
        if (err) return res.send(err)
        res.type('json')
        res.json(req.body)
        res.status(200)
        res.end()
      })
    })
  })
  .delete((req, res) => {
    Artists.findById(req.params.id, (err, artist) => {
      artist.remove((err, artist) => {
        res.type('json')
        res.json(artist)
        res.status(200)
        res.end()
      })
    })
  })

  apiRouter.route('/avgDope')
  .get((req, res) => {
    Artists.find({}, (err, artists) => {
      let avgDope = artists.reduce((acc, artist) => {
        return acc + (artist.dopenessFactor || 0)
      }, 0) / +artists.length
      res.json('The average dopeness of all the artists is the database is ' + avgDope)
      res.end()
    })
  })
}
