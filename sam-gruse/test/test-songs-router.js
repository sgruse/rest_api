'use strict'

let chai = require('chai');
let chaiHTTP = require('chai-http');
chai.use(chaiHTTP);

let request = chai.request;
let expect = require('chai').expect;
let url = require('url');
let fs = require('fs');
let User = require(__dirname + '/../models/createUser-model');
let mongoose = require('mongoose')
require('dotenv').load();
process.env.MONGO_LAB_URI = 'mongodb://localhost/testdb';

let Songs = require(__dirname + '/../models/songs-model');
require(__dirname + '/../server');
let newUserToken;

// TESTING SONGS ROUTER
describe('Testing "Songs" router', () => {

// TESTING CREATION OF A NEW USER
it('Should create a new user', (done) => {
  request('localhost:3000')
  .post('/public/createUser')
  .send('{"name":"Bob", "password":"dob"}')
  .end((err, res) => {
    expect(res).to.be.a('object')
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
// TESTING GET WITH EXISTING USER CREDENTIALS
  it('Should return a JSON object and status code', (done) => {
    request('localhost:3000')
    .get('/api/songs')
    .set('Authorization', 'token ' + newUserToken)
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res).to.be.a('object')
      done()
    })
  })
// TESTING POST WITH EXISTING USER CREDENTIALS
  it('Should return the posted object in JSON format', (done) => {
    request('localhost:3000')
    .post('/api/songs')
    .set('Authorization', 'token ' + newUserToken)
    .send('{"title":"Alright", "artist":"Future", "dopenessFactor":6, "genre":"Hip-Hop"}')
    .end((err, res) => {
      expect(err).to.eql(null)
      expect(res.status).to.eql(200)
      expect(res.body.artist).to.eql('Future')
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
    .put('/api/songs/' + id)
    .set('Authorization', 'token ' + newUserToken)
    .send('{"title":"REPLACEMENT"}')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      expect(res.body.nModified).to.eql(1)
      expect(res).to.be.a('object')
      done()
    })
  })
// TESTING DELETE
  it('Should delete an item after grabbing its ID from the before block', (done) => {
    request('localhost:3000')
    .delete('/api/songs/' + id)
    .set('Authorization', 'token ' + newUserToken)
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
    .get('/api/mostPopArtist')
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
