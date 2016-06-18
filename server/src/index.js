///<reference path='typings/index.d.ts'/>
"use strict";
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
io.on('connection', function (socket) {
    console.log('a user connected');
});
server.listen(3000, function () {
    console.log('listening on *:3000');
});
//# sourceMappingURL=index.js.map