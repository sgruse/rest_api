'use strict'

let chai = require('chai')
let chaiHTTP = require('chai-http')
chai.use(chaiHTTP)

let request = chai.request
let expect = require('chai').expect
let url = require('url')
let fs = require('fs')
let mongoose = require('mongoose')
let User = require(__dirname + '/../models/createUser-model')
require('dotenv').load()
process.env.MONGO_LAB_URI = 'mongodb://localhost/testdb';

let Artists = require(__dirname + '/../models/artists-model')
let newUserToken;

require(__dirname + '/../server')

// TESTING ARTISTS ROUTER
describe('Testing "Artists" router', () => {

  // TESTING CREATION OF A NEW USER
  it('Should create a new user', (done) => {
    request('localhost:3000')
    .post('/public/createUser')
    .send('{"name":"Bob", "password":"dob"}')
    .end((err, res) => {
      expect(err).to.eql(null)
      done();
    })
  })
  // TESTING LOGIN WITH THE USER CREATED ABOVE
  it('Should find my new user in the database and send back a user token', (done) => {
    request('localhost:3000')
    .post('/login/login')
    .auth('Bob:dob')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.body).to.have.property('token')
      newUserToken = res.body.token;
      done();
    })
  })
 // TESTING GET
  it('Should hit the "GET" route and return a JSON object and status code', (done) => {
    request('localhost:3000')
    .get('/api/artists')
    .set('Authorization', 'token ' + newUserToken)
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
    .post('/api/artists')
    .set('Authorization', 'token ' + newUserToken)
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
    .put('/api/artists/' + id)
    .set('Authorization', 'token ' + newUserToken)
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
    .delete('/api/artists/' + id)
    .set('Authorization', 'token ' + newUserToken)
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
    .get('/api/avgDope')
    .set('Authorization', 'token ' + newUserToken)
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
})
after((done) => {
  newUserToken = '';
  mongoose.connection.db.dropDatabase(() => {
    done();
  })
})
