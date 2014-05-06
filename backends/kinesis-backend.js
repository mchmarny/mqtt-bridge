/*

	Requires aws api
	http://aws.amazon.com/sdkfornodejs/

	To Install:
		npm install aws-sdk
		
*/


var utils = require('../lib/utils').init(),
	 AWS = require('aws-sdk');
	 
var KinesisBackend = function (config, events, logger){
	var self = this;
	self.config = config;
	self.logger = logger;

	// configure
	AWS.config.region = config.config.region;
	AWS.config.apiVersions = config.config.apiVersion;

	// stream
	var kinesis = new AWS.Kinesis();

	events.on('data', function(topic, message){
		self.process(topic, message);
	});
	events.on('flush', function(callback){
		self.flush(callback);
	});
	logger.info("Kinesis backend created %j", config);
};

KinesisBackend.prototype.process = function(topic, message) {
	var self = this;
	var cleanTopic = utils.replaceAll("/", ":", topic);
	self.logger.debug("[%s] %s", cleanTopic, message);

	var putArgs = {
	  Data: utils.toBase64EncodedString(obj),
	  PartitionKey: cleanTopic,
	  StreamName: config.config.stream
	};
	kinesis.putRecord(putArgs, function(err, data) {
	  if (err) console.log(err, err.stack);
	  else     console.log(data);
	});

};

KinesisBackend.prototype.flush = function(callback) {
	var self = this;
	self.logger.debug("No messages to flush");
	callback();
};

exports.init = function(config, events, logger) {
  var backendInstance = new KinesisBackend(config, events, logger);
  return true;
}; 


/*
@TODO: Implement stream status check
var stateArgs = { StreamName: config.config.stream };
kinesis.describeStream(stateArgs, function (err, data) {
  if (err) console.log(err, err.stack);
  else {
  	if (!data || 
  		 !data.StreamDescription || 
  		 !data.StreamDescription.StreamStatus){
  		console.log('Null status response');
  		return;
  	}
  	var status = data.StreamDescription.StreamStatus;
  	console.log('STATUS: ' + status);
  }
});
*/
