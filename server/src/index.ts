///<reference path='typings/index.d.ts'/>

import socketio = require("socket.io");
import Promise = require("promise");
import fs = require("fs");

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

var io = socketio();
io.on('connection', (socket) => {
    console.log('a user connected');
});

io.listen(3000);
