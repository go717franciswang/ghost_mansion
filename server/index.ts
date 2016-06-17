import * as express from "express";
import * as http from "http";
import * as socketio from "socket.io";

var app = express();
var server = http.Server(app);
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
