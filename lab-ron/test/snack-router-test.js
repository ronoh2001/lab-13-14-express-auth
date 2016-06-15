'use strict';

process.env.APP_SECRET = process.env.APP_SECRET ||'slugs are secret hahah';
process.env.MONGODB_URI = process.env.MONGODB_URI ||'mongodb://localhost/test';

const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('snackdemo:snack-router-test');

const snackController = require('../controller/snack-controller');
const authController = require('../controller/auth-controller');
const userController = require('../controller/auth-controller');

const port = process.env.PORT ||3000;
const baseURL = `localhost:${port}/api`;
const server = require('../server');
request.use(superPromise);

describe('testing module snack router', function(){
  before((done) => {
    debug('before module snack-router');
    if(!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        debug(`server up ::: ${port}`);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    debug('after module snack-router');
    if(server.isRunning) {
      server.close(() =>{
        server.isRunning = false;
        debug('server down');
        done();
      });
      return;
    }
    done();
  });
  describe('testing module snack router', function(){
    beforeEach((done) => {
      authController.signup({username: 'slug', password: 'slug2.0.4'})
      .then(token => this.tempToken = token)
      .then(() => done())
      .catch(done);
    });
    afterEach((done) => {
      Promise.all([
        userController.removeAllUsers()
      , snackController.removeAllSnacks()
      ])
    .then(() => done())
    .catch(done);
    });
    describe('testing post /api/snack', () =>{
      it('should return a snack', (done) => {
        request.port(`${baseURL}/snack)`)
        .send({
          name: 'yumm bowl'
        , ingredients: ['y', 'u', 'm']
        })
      .set({
        Authorization: `Bearer ${this.tempToken}`
      })
      .then(res => {
        console.log(res.body);
        expect(res.status).to.equal(200);
        done();
      }).catch(done);
      });
    });
  });

});
