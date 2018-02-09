const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io');
const passport = require('passport')
const auth = require('./auth')(app,passport);

require('./router')(app,http,passport);
app.use('/',express.static(__dirname + '/public'))

app.listen(3002)
