// Module dependencies.

var http = require('http')
  , ws = require('websocket.io')

var dgram = require('dgram');

var fs = require('fs');
var ui = fs.readFileSync('UI.html');

// UDP server

var PORT = 33333;
var HOST = '127.0.0.1';
var UDPServer = dgram.createSocket('udp4');

// HTTP Server

var server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(ui);
});

var clients = [];

// Attach websocket.io

var webSocketServer = ws.attach(server);

webSocketServer.on('connection', function(socket) {
  console.log('websocket connection opened')
  clients.push(socket);

  socket.on('close', function() {
    console.log('websocket connection closed')
    clients.splice(clients.indexOf(socket));
  });
});

UDPServer.on('listening', function () {
    var address = UDPServer.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

UDPServer.on('message', function (message, remote) {
  console.log(remote.address + ':' + remote.port +' - ' + message);
  console.log("Sending to clients - ", clients.length);
  var messageArray = message.toString().split(",s")
  clients.forEach(function(client) {
    var payload = JSON.stringify({
      message: messageArray
    });
    client.send(payload);
  });

});

// Listen.

UDPServer.bind(PORT, HOST);

server.listen(3000, function () {
  console.log('HTTP server listening on http://127.0.0.1:3000');
});
