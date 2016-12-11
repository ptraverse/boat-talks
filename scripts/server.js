var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '../public')));

io.on('connection', function (socket) {

    socket.on('identify', function (name) {
        console.log('backend - new user identifying: ' + name);
        socket.name = String(name || 'Anonymous');
        console.log('backend - socket set name done: ' + socket.name);
    });

    socket.on('move', function(data) {
        console.log('backend - broadcast moving: ' + data.lat + ', ' + data.lon);
        socket.broadcast.emit('move', data);
    });

});

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
