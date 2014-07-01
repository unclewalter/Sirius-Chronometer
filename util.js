// strip out null characters
var cleanMessage = function (message) {
  return message.toString().replace(/\0/g, '');
};

// remove empty messages
var notEmpty = function (string) {
  return string && string.length > 0;
}

module.exports = {
  datagramToArray: function(datagram) {
    return cleanMessage(datagram).split(",").filter(notEmpty);
  }
};
