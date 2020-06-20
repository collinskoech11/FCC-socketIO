'use strict';

const express     = require('express');
const session     = require('express-session');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const auth        = require('./app/auth.js');
const routes      = require('./app/routes.js');
const mongo       = require('mongodb').MongoClient;
const passport    = require('passport');
const cookieParser= require('cookie-parser')
const app         = express();
const http        = require('http').Server(app);
const sessionStore= new session.MemoryStore();
require('dotenv').config();
const io = require('socket.io')(http);


fccTesting(app); //For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));


mongo.connect(process.env.DATABASE,{ useUnifiedTopology: true }, (err, db) => {
    if(err) console.log('Database error: ' + err);
  
    auth(app, db);
    routes(app, db);
      

    let port =process.env.PORT || 3000
    http.listen(port, ()=>{
      console.log(`App listening on port ${port}`);
      
    });

  
    //start socket.io code  

    // The first thing needing to be handled is listening for a new connection from the client. The on keyword does just that- listen for a specific event

    // It requires 2 arguments: a string containing the title of the event thats emitted, and a function with which the data is passed though.

    // io.on('connection', socket => {
    //   console.log('A user has connected');
      
    // })


  

    //end socket.io code
  
  
});
