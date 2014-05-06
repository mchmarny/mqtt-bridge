/*
Posts all mqtt messages to Xively feed.
Transforms mqtt topic to Xively datastream name.
Optionally transforms mqtt payload to value using JSONPath - to be used if payloads are JSON data.

Requires node-rest-client
npm install node-rest-client

Optionally reqieres JSONPath if jsonpath config is used
npm install JSONPath

Configuration

  "backends": [
  
    {
      "handler": "./backends/xively-backend.js",
      "config": {
        "feed": "YOUR_FEED_ID_HERE",  
        "apikey": "YOUR_FEED_KEY_HERE",
        "jsonpath": "$.value'

      }
    }
    
  ]

The jsonpath config assumes the mqtt messages are json data such as 
{"value":3,"unit": "Celsius"} and you want to post to xively only its value. 
If message is plain text, jsonpath config has to be omitted.


Created by Vaclav Synacek, https://github.com/VaclavSynacek/
BSD license
*/


var utils = require('../lib/utils').init();
var RESTClient = require('node-rest-client').Client;

var XivelyBackend = function (config, events, logger) {
  var self = this;
  self.config = config;
  self.logger = logger;
  events.on('data', function (topic, message) {
    self.process(topic, message);
  });
  events.on('flush', function (callback) {
    self.flush(callback);
  });

  //Xively backend specific config
  self.restClient = new RESTClient();
  self.endpoint = config.config.endpoint || 'api.xively.com';
  self.apikey = config.config.apikey;
  self.feed = config.config.feed;
  self.jsonpath = config.config.jsonpath;

  logger.info("Xively backend created %j", config);
};

XivelyBackend.prototype.process = function (topic, message) {
  var self = this;

  self.logger.debug("[%s] RAW_INPUT: %s > %s", self.config.index, topic, message);

  //remove slashes which are not allowed in datastream names
  var datastream = utils.replaceAll("/", ":", topic);

  //if jsonpath is specified in config, then use it to convert mqtt message to datastream value
  var value = (self.jsonpath) ? self.applyJsonPath(message) : message;

  self.logger.debug("[%s] PROCESSED: %s > %s", self.config.index, datastream, value);

  self.send2Xively(datastream, value);
};

XivelyBackend.prototype.flush = function (callback) {
  var self = this;
  self.logger.debug("No messages to flush");
  callback();
};

XivelyBackend.prototype.send2Xively = function (datastream, value) {
  var self = this;
  var args = {
    data: {
      "datastreams": [{
        "id": datastream,
        "current_value": value
      }]
    },
    headers: {
      "X-ApiKey": self.apikey
    }
  };

  self.restClient.put('http://' + self.endpoint + '/v2/feeds/' + self.feed + '.json', args, function (data, response) {
    self.logger.debug("[%s] Xively status: %s response: %s", self.config.index, response.statusCode, data);
  });
};

XivelyBackend.prototype.applyJsonPath = function (source) {
  var self = this;
  var json = JSON.parse(source);
  var selectedJson = require('JSONPath').eval(json, self.jsonpath);
  return selectedJson[0];
}

exports.init = function (config, events, logger) {
  var backendInstance = new XivelyBackend(config, events, logger);
  return true;
};