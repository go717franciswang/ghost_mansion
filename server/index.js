///<reference path='typings/index.d.ts'/>
"use strict";
var socketio = require("socket.io");
var maps = {};
var mapNames = ["main-floor", "research-lab"];
mapNames.forEach(function (m) {
    maps[m] = require(__dirname + '/../resources/ghost_mansion/' + m + '.json');
});
var io = socketio();
var playerId = 0;
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(maps);
    var player = {
        position: { x: 50, y: 50 },
        flashlight: 100,
        playerId: playerId++
    };
    socket.on('move', function (data) {
        console.log('got move command');
        player.position.x += data.dx;
        player.position.y += data.dy;
    });
    socket.on('flashlight', function (data) {
        console.log('got flashlight command');
        if (data.on) {
            player.flashlight -= 1;
        }
    });
    setInterval(function () {
        console.log(player);
    }, 1000);
});
io.listen(3000);
//# sourceMappingURL=index.js.map