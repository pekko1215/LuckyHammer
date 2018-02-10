const express = require('express');
const app = express();
const http = require('http').Server(app);
const sessionStore = new express.session.MemoryStore;
const socket = require('socket.io');
const passport = require('passport')
const auth = require('./auth')(app,passport,sessionStore);


require('./router')(app,http,passport);
app.use('/',express.static(__dirname + '/public'))


require('./socket')(app,socket,sessionStore)

app.listen(3002)
console.log("Start Server at " + new Date);
