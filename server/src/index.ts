///<reference path='typings/index.d.ts'/>

import socketio = require("socket.io");
import fs = require("fs");

var maps = {};
var mapNames = ["main-floor", "research-lab"];
mapNames.forEach((m) => { 
    maps[m] = require(__dirname + '/../resources/ghost_mansion/'+m+'.json');
});

var game = new Phaser.Game(320, 240, Phaser.HEADLESS);
var physics = new Phaser.Physics.Arcade(game);

var io = socketio();
var playerId = 0;
io.on('connection', (socket) => {
    console.log('a user connected');
    console.log(maps);
    var player:any = {
        body: null,
        x: 50,
        y: 50,
        position: { x: 50, y: 50 },
        flashlight: 100,
        playerId: playerId++
    };
    var body = new Phaser.Physics.Arcade.Body(player);
    player.body = body;
    physics.enableBody(player);

    socket.on('move', (data) => {
        console.log('got move command');
        player.position.x += data.dx;
        player.position.y += data.dy;
    });

    socket.on('flashlight', (data) => {
        console.log('got flashlight command');
        if (data.on) {
            player.flashlight -= 1;
        }
    });

    setInterval(() => {
        console.log(player);
    }, 1000);
});

io.listen(3000);
