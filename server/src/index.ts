///<reference path='typings/index.d.ts'/>

import http = require("http");
import express = require("express");
import socketio = require("socket.io");

var app = express();
var server = http.createServer(app);
var io = socketio(server);

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
