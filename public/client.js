var qlist = {startref: 0,
                 cues: []
  };

(function(global) {
  // socket.io does auto-discovery with no params
  var socket = io();

  /* Format
  startref: <set to Date.now() on start trigger>
  cues:
  */

  socket.on('connect', function () {
    console.log('connected to WebSocket at', socket.io.uri);
  });

  socket.on('disconnect', function () {
    console.log('socket disconnected');
  });

  socket.on('max-message', function (message) {
    var messagetype = message[0];
    console.log("Message type: " + messagetype);
    message.shift();
    console.log(message);

  // Message routing
  // Tried to implement it better using a dictionary/map. Will attempt again later.
  switch (messagetype) {
    case "qlist":
      qlist.cues = message;
      console.log(qlist);
      break;
    case "write":
      document.getElementById("TC_Field").innerHTML = message;
      break;
    default:
      console.error("Invalid Max message type.")
  }


  });


})(window);
