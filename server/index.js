///<reference path='typings/index.d.ts'/>
"use strict";
var socketio = require("socket.io");
var Phaser = require("phaser");
var maps = {};
var mapNames = ["main-floor", "research-lab"];
mapNames.forEach(function (m) {
    maps[m] = require(__dirname + '/../resources/ghost_mansion/' + m + '.json');
});
var game = new Phaser.Game(320, 240, Phaser.HEADLESS);
var physics = new Phaser.Physics.Arcade(game);
var io = socketio();
var playerId = 0;
io.on('connection', function (socket) {
    console.log('a user connected');
    console.log(maps);
    var sprite = new Phaser.Sprite(game, 50, 50);
    var player = {
        body: null,
        x: 50,
        y: 50,
        position: { x: 50, y: 50 },
        flashlight: 100,
        playerId: playerId++
    };
    var body = new Phaser.Physics.Arcade.Body(player);
    player.body = body;
    sprite.body = body;
    physics.enableBody(sprite);
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