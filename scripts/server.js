var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var _ = require('underscore');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '../public')));
var roster = [];
console.log('initialized empty roster: ');
console.log(roster);

io.on('connection', function (socket) {
    console.log('a user connected: ' + socket.id);

    // socket.on('identify', function (name) {
    //     console.log('backend - new user identifying: ' + name);
    //     roster.push(socket.name);
    //     console.log('backend - added socket to roster');
    //     console.log(roster);
    // });

    socket.on('identifyWithLocation', function (data) {
        console.log('backend - new user identifying WITH LOCATION: ' + data.name);
        roster.push(data);
        console.log('new roster: ');
        console.log(roster);
        //SEND IT TO EVERYONE
        io.sockets.emit('rosterUpdate', roster);
    });

    socket.on('move', function(data) {
        console.log('backend - broadcast moving: ' + data.lat + ', ' + data.lon);
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function() {
        console.log(socket.name + ' disconnecting ' + socket.id);
    });

});

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
  console.log("Due to geolocation, use Dev Server at http://localhost:8080");
});
