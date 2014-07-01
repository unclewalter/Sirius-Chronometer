(function(global) {
  // socket.io does auto-discovery with no params
  var socket = io();

  socket.on('connect', function () {
    console.log('connected to WebSocket at', socket.io.uri);
  });

  socket.on('max-timestamp', function (timestamp) {
    document.getElementById("TC_Field").innerHTML = timestamp;
  });

})(window);


