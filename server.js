var config  = require('./config');
var util    = require('./util');
var express = require('express');
var app     = express();
var logger  = require('morgan');
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var dgram   = require('dgram');

var debug = function() {
  if (config.debug) {
    console.log.apply(console, arguments);
  }
};

// log all the things
app.use(logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// send index.html
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/index.html');
});

// fire up some websockets
io.on('connection', function (socket) {
  debug('[io]', 'client connected:', socket.id);

  socket.on('disconnect', function () {
    debug('[io]', 'client disconnected:', socket.id);
  });
});

// UDP server
var udpServer = dgram.createSocket('udp4');

udpServer.on('message', function (datagram, remote) {
  var messages = util.datagramToArray(datagram);

  debug('[udp]', 'datagram:', datagram);
  debug('[io]', 'max-timestamp', messages);

  io.emit('max-timestamp', messages)
});

udpServer.on('listening', function () {
    var address = udpServer.address();
    console.log('UDP Server listening on udp://' + address.address + ":" + address.port);
});

// start the apps
server.listen(config.port, function () {
  console.log('Server running at http://127.0.0.1:' + config.port);
});

udpServer.bind(config.udp.port, config.udp.host);
