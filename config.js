var env = process.env;

module.exports =  {
  // TCP port for the clients to connect to.
  port: env['PORT'] || 3000,

  // udp connection details for MaxMSP
  udp: {
    port: 33333,
    host: '127.0.0.1'
  },

  // enable verbose logging
  debug: true
};

