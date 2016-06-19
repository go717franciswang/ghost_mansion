///<reference path='typings/index.d.ts'/>
"use strict";
var socketio = require("socket.io");
var Promise = require("promise");
var fs = require("fs");
var loadMap = function (mapName) {
    return new Promise(function () {
        fs.readFile(__dirname + '/../resources/ghost_mansion/' + mapName + '.json', function (err, data) {
            if (err)
                throw err;
            var map = JSON.parse(data.toString());
            var walls = map.layers.filter(function (l) { return l.name == 'walls'; })[0];
            Promise.resolve(walls);
        });
    });
};
var io = socketio();
io.on('connection', function (socket) {
    console.log('a user connected');
});
io.listen(3000);
//# sourceMappingURL=index.js.map