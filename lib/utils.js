var fs = require("fs");
    path = require("path");
    os = require("os");
    
function BridgeUtils(){};

BridgeUtils.prototype.parseTopic = function(str, s, v) {
  var me = this;
  //TODO:implement
  return null;  
};

exports.init = function() {
  return new BridgeUtils();
};  
