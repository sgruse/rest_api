'use strict';

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
describe('Testing for users authentication and uniqueness', () => {
// CREATING A NEW USER FOR TESTING
  it('Should create a new user', (done) => {
    request('localhost:3000')
    .post('/public/createUser')
    .send('{"name":"Joe", "password":"Budden"}')
    .end((err, res) => {
      expect(res.status).to.eql(200)
      done();
    })
  })
// TESTING FOR A NON UNIQUE USER NAME
  it('Should respond with an error because of non unique username', (done) => {
    request('localhost:3000')
    .post('/public/createUser')
    .send('{"name":"Joe", "password":"Budden"}')
    .end((err, res) => {
      expect(res.status).to.eql(404)
      expect(res.text).to.eql('{"msg":"Not a valid username"}')
      done();
    })
  })
// TESTING FOR FALSE AUTHENTICATION OF USER
  it('Should fail the login because of incorrect authentication', (done) => {
      request('localhost:3000')
      .post('/login/login')
      .auth('Joe:Wrong')
      .end((err, res) => {
        expect(res.text).to.eql('{"status":"failure"}')
        done();
      })
    })
// TESTING FOR INCORRECT HEADERS
  it('Should return an error because of incorrect Headers being sent', (done) => {
    request('localhost:3000')
    .get('/api/artists')
    .set('Authorization', 'token ', 'someString')
    .end((err, res) => {
      expect(res.status).to.eql(404)
      done();
    })
  })
})

after((done) => {
  newUserToken = '';
  mongoose.connection.db.dropDatabase(() => {
    done();
  })
})
