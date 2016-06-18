///<reference path='typings/index.d.ts'/>
"use strict";
var http = require("http");
var express = require("express");
var socketio = require("socket.io");
var fs = require("fs");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
fs.readFile(__dirname + '/../resources/ghost_mansion/main-floor.json', function (err, data) {
    if (err)
        throw err;
    var map = JSON.parse(data.toString());
    var walls = map.layers.filter(function (l) { return l.name == 'walls'; })[0];
    console.log(walls);
});
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