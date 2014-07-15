var osc   = require('node-osc');
var oscServer = new osc.Server(33333, '127.0.0.1');
var config  = require('./config');

oscServer.on("message", function (msg, rinfo) {
      console.log("TUIO message:");
      console.log(msg);
});

