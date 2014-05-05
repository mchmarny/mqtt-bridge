var fs = require("fs");
    path = require("path");
    os = require("os");
    
function BridgeUtils(){};

BridgeUtils.prototype.replaceAll = function (find, replace, str) {
  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  return str.replace(new RegExp(find, 'g'), replace);
}

BridgeUtils.prototype.toBase64EncodedString = function(str){
  return new Buffer(str || '').toString('base64');
};

exports.init = function() {
  return new BridgeUtils();
};  
