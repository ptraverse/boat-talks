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

io.on('connection', function (socket) {

    socket.on('identify', function (name) {
        console.log('backend - new user identifying: ' + name);
        roster.push(socket.name);
        console.log('backend - added socket to roster');
        console.log(roster);
    });

    socket.on('identifyWithLocation', function (data) {
        console.log('backend - new user identifying WITH LOCATION: ' + data.name);
        console.log(data.lat);
        console.log(data.lon);
        roster.push(data);
        console.log('backend - added socket with location to roster');
        console.log(roster);
    });

    socket.on('move', function(data) {
        console.log('backend - broadcast moving: ' + data.lat + ', ' + data.lon);
        socket.broadcast.emit('move', data);
    });

    socket.on('disconnect', function() {
        console.log(socket.name + ' disconnecting');
        roster = _.filter(roster, function(index, sock) {
            console.log('_filtering out index and sock:');
            console.log(index);
            console.log(sock);
            return sock.name !== socket.name;
        });
    });

});

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
