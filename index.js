const express = require('express');
const app = express();
const http = require('http').Server(app);
const socket = require('socket.io');

const auth = require('./auth')(app);

app.use('/',express.static(__dirname + '/public'))
app.use('/',require('./router'));

app.listen(3000)