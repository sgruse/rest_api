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

let Artists = require(__dirname + '/../models/artists-model')

require(__dirname + '/../server')

// TESTING ARTISTS ROUTER
describe('Testing "Artists" router', () => {

 // TESTING GET
  it('Should hit the "GET" route and return a JSON object and status code', (done) => {
    request('localhost:3000')
    .get('/artists')
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
    .post('/artists')
    .send('{"name":"GRUSEM", "age":26, "dopenessFactor":10, "genre":"Dubstep"}')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res.body).to.have.property('_id')
      done()
    })
  })
})

// NEW DESCRIBE BLOCK FOR TESTING PUT AND DELETE
describe('Testing "PUT" after running a "before" post to test for updating functionality', () => {
  let id;
  beforeEach(function(done) {
    let artistTester = new Artists ({name: 'TEST ENTRY', dopenessFactor: 7})
    artistTester.save(function(err, data) {
      id = data._id
      done()
    })
  })

// TESTING PUT
  it('Should update a post inside database', (done) => {
    request('localhost:3000')
    .put('/artists/' + id)
    .send('{"name":"REPLACEMENT"}')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })

// TESTING DELETE
  it('Should delete an item after grabbing its ID from the before block', (done) => {
    request('localhost:3000')
    .delete('/artists/' + id)
    .end((err, res) => {
      expect(res.status).to.eql(200)
      done()
    })
  })
})

// ALTERNATE ROUTE TESTING
describe('Testing alternate endpoint that will get the most frequently occurring artist in the artists database', () => {
  beforeEach(function(done) {
    let mostCommon = new Artists ({dopenessFactor: 8})
    mostCommon.save(function(err, data) {
      this.mostCommon = data
      done()
    }.bind(this))
  })

  it('Should take find all of the artist in the database and figure out the average dopeness factor', (done) => {
    request('localhost:3000')
    .get('/avgDope')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
})
