//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var stormpath = require('express-stormpath');
// var stormpath = require('stormpath');
var bodyParser = require('body-parser');
var routes = require('./routes');

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
   
    socket.emit('server event', { foo: 'bar' });
    
    socket.on('client event', function (data) {
      console.log(data);
    });
    
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

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
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

app.set('trust proxy',true);
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static(process.cwd() + '/bower_components'));
app.use(express.static(path.resolve(__dirname, 'public')));

/**
 * Route initialization.
 */
app.use('/', routes);

app.on('stormpath.ready',function () {
  console.log('Stormpath Ready');
});

// app.use(stormpath.init(app, {
//   expand: {
//     customData: true
//   }
// }));

/**
 * Start the web server.
 */
var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening on http://localhost:' + port);
});