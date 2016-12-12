var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
var _ = require('underscore');

router.use(express.static(path.resolve(__dirname, '../public')));
var roster = [];

io.on('connection', function (socket) {

  socket.on('identifyWithLocation', function (data) {
    data.id = socket.id;
    roster.push(data);
    //Send roster update to everyone (including the sender!)
    io.sockets.emit('rosterUpdate', roster);
  });

  socket.on('move', function(data) {
    socket.broadcast.emit('move', data);
  });

  socket.on('disconnect', function() {
    console.log(socket.name + ' disconnecting ' + socket.id);
    roster = _.filter(roster, function(sock) {
      return sock.id !== socket.id;
    });
    console.log('removed roster item?');
    console.log(roster);
    io.sockets.emit('rosterUpdate', roster);
  });

});

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
  console.log("Due to geolocation, use Dev Server at http://localhost:8080");
});
