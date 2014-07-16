(function(global) {
  // socket.io does auto-discovery with no params
  var socket = io();
  var displayLoop;
  var startref = 0;

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
    console.log(message)

    // Message routing
    // Tried to implement it better using a dictionary/map. Will attempt again later.
    switch (messagetype) {
      case "write":
        document.getElementById("TC_Field").innerHTML = message;
        break;
      case "start":
        startref = Date.now();
        start(message[0]);
        break;
      case "stop":
        clearInterval(displayLoop);
        break;
      case "movement":
        document.getElementById("MVT_Field").innerHTML = message;
        break;
      case "marker":
        document.getElementById("MKR_Field").innerHTML = message;
        break;
      default:
        console.error("Invalid Max message type.")
    }

    function start(offset) {
      if (typeof offset === "undefined") { offset = 0; }
      displayLoop = setInterval(function() {
        var rawclock = (Date.now()-startref) + offset;
        var centseconds = Math.floor(rawclock/10);
        var seconds = Math.floor(rawclock/1000)%60;
        var minutes = Math.floor(rawclock/60000);
        var TC_Format = pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(centseconds, 2);
        document.getElementById("TC_Field").innerHTML = TC_Format;
      },10)
    }

    function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    }

  });


})(window);
