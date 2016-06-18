///<reference path='typings/index.d.ts'/>

import http = require("http");
import express = require("express");
import socketio = require("socket.io");
import Promise = require("promise");
import fs = require("fs");

var app = express();
var server = http.createServer(app);
var io = socketio(server);

var loadMap = (mapName) => {
    return new Promise(() => {
        fs.readFile(__dirname + '/../resources/ghost_mansion/'+mapName+'.json', (err, data) => {
            if (err) throw err;
            var map = JSON.parse(data.toString());
            var walls = map.layers.filter((l) => { return l.name == 'walls' })[0];
            Promise.resolve(walls);
        });
    });
};

app.get('/', (req, res) => {
    res.sendfile('index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
