var config  = require('./config');
var util    = require('./util');
var express = require('express');
var app     = express();
var logger  = require('morgan');
var server  = require('http').Server(app);
var io      = require('socket.io')(server);
var osc     = require('node-osc')

var debug = function() {
  if (config.debug) {
    console.log.apply(console, arguments);
  }
};

var marker = "";
var movement = "";

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

  io.emit('max-message', ["movement", movement]);
  io.emit('max-message', ["marker", marker]);

  socket.on('disconnect', function () {
    debug('[io]', 'client disconnected:', socket.id);
  });
});

// OSC server
var oscServer = new osc.Server(config.udp.port, config.udp.host);

oscServer.on("message", function (datagram, rinfo) {
  // var messages = util.datagramToArray(datagram);

  debug('[udp]', 'datagram:', datagram);
  debug('[io]', 'max-message', datagram);

  // send max message to clients
  io.emit('max-message', datagram);

  var messagetype = datagram[0];
  datagram.shift();

  switch (messagetype) {
    case "movement":
      movement = datagram[0];
      break;
    case "marker":
      marker = datagram[0];
      break;
  }
});

// start the apps
server.listen(config.port, function () {
  console.log('Server running at http://127.0.0.1:' + config.port);
});
