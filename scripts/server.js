var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '../public')));
var messages = [];
var sockets = [];

io.on('connection', function (socket) {

    messages.forEach(function (data) {
        socket.emit('message', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
        sockets.splice(sockets.indexOf(socket), 1);
        updateRoster();
    });

    socket.on('message', function (msg) {
        var text = String(msg || '');

        if (!text)
            return;

        var name = socket.name;
        var data = {
            name: name,
            text: text
        };

        broadcast('message', data);
        messages.push(data);

    });

    socket.on('identify', function (name) {
        console.log('new user identifying: ' + name);
        socket.name = String(name || 'Anonymous');
        console.log('socket set name done: ' + socket.name);
        updateRoster();
    });

    socket.on('move', function(data) {
        console.log('user moving: ' + data.lat + ', ' + data.lon);
        broadcast('move', data);
    });
  });

function updateRoster() {
    async.map(
        sockets,
        function (socket, callback) {
            socket.name;
            callback();
        },
        function (err, names) {
        broadcast('roster', names);
        }
    );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
