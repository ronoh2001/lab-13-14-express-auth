'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('authdemo:server');
//app modules
const handleError = require('./lib/handle-error');
const authRouter = require('./controller/auth-controller');
const parserBearerAuth = require('./lib/parse-bearer-auth');
const snackRouter = require('./route/snack-router');
//const variables
const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'monogdb://localhost/authdemodev';
//setup mongo
mongoose.connect(mongoURI);

//set middleware
app.use(morgan('dev'));

//setup routes
app.all('/', parserBearerAuth, function(req, res){
  console.log('req.userId', req.userId);
  res.send('boooya');
});
app.use('/api', authRouter);
app.use('api', snackRouter);
app.all('*', function(req, res, next){
  debug('404 * route');
  next(httpErrors(404, 'no such route'));
});

app.use(handleError);
//start server
const server = app.listen(port, function(){
  debug('server up', port);
});

server.isRunning = true;
module.exports = server;
