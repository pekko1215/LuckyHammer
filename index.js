const express = require('express');
const app = express();
const http = require('http').createServer(app);
const sessionStore = new (require('express-session').MemoryStore);

const socket = require('socket.io');
const passport = require('passport')
const auth = require('./auth')(app,passport,sessionStore);


require('./router')(app,http,passport);
app.use('/',express.static(__dirname + '/public'))


require('./socket')(app,app.listen(3002),socket,sessionStore)

//app.listen(3002)
console.log("Start Server at " + new Date);
