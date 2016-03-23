'use strict'

let chai = require('chai')
let chaiHTTP = require('chai-http')
chai.use(chaiHTTP)

let request = chai.request
let expect = require('chai').expect
let url = require('url')
let fs = require('fs')
let mongoose = require('mongoose')
process.env.MONGO_LAB_URI = 'mongodb://localhost/testdb';

let Songs = require(__dirname + '/../models/songs-model')

require(__dirname + '/../server')

// TESTING SONGS ROUTER
describe('Testing "Songs" router', () => {

// TESTING GET
  it('Should return a JSON object and status code', (done) => {
    request('localhost:3000')
    .get('/songs')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })

// TESTING POST
  it('Should return the posted object in JSON format', (done) => {
    request('localhost:3000')
    .post('/songs')
    .send('{"title":"Alright", "artist":"Future", "dopenessFactor":6, "genre":"Hip-Hop"}')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      expect(res.body).to.have.property('_id')
      done()
    })
  })
})

// NEW DESCRIBE BLOCK FOR TESTING PUT AND DELETE
describe('Testing "PUT" after running a "before" post to test for updating functionality', () => {
  let id;
  beforeEach(function(done) {
    let songTester = new Songs ({title: 'TEST ENTRY'})
    songTester.save(function(err, data) {
      id = data._id
      done()
    })
  })

// TESTING PUT
  it('Should update a post inside database', (done) => {
    request('localhost:3000')
    .put('/songs/' + id)
    .send('{"title":"REPLACEMENT"}')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })

// TESTING DELETE
  it('Should delete an item after grabbing its ID from the before block', (done) => {
    request('localhost:3000')
    .delete('/songs/' + id)
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
})

// ALTERNATE ROUTE TESTING
describe('Testing alternate endpoint that will get the most frequently occurring artist in the artists database', () => {
  beforeEach(function(done) {
    let mostCommon = new Songs ({artist: 'Big Boi'})
    mostCommon.save(function(err, data) {
      this.mostCommon = data
      done()
    }.bind(this))
  })

  it('Should take find all of the artist in the database and figure out the most common name', (done) => {
    request('localhost:3000')
    .get('/mostPopArtist')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
})
