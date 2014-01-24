/*

	Requires statsd
	https://github.com/sivy/node-statsd

	Either one will do:
		npm install node-statsd
		
*/

var utils = require('../lib/utils').init(),
    StatsD = require('node-statsd').StatsD;


var StatsdBackend = function (config, events, logger){
	var self = this;
	self.config = config;
	self.logger = logger;
	self.messageCounter = config.config.counter || "message.counter";

	var client = client = new StatsD(config.config.options || {});

	client.socket.on('error', function(error) {
	  return logger.error("Error in socket: ", error);
	});

	self.client = client;

	events.on('data', function(topic, data){
		self.save(topic, data);
	});
	
	logger.info("Statsd backend created %j", config);
};

StatsdBackend.prototype.save = function(topic, data) {
	if (!topic || !data) return;
	var self = this;
	var cleanTopic = utils.replaceAll("/", "-", topic);
	self.logger.debug("[%s] %s > %s", self.config.index, cleanTopic, data);

	// count topics
	self.client.increment(key);

	// count all messages
	self.client.increment(self.messageCounter);
};

exports.init = function(config, events, logger) {
  var backendInstance = new StatsdBackend(config, events, logger);
  return true;
}; 
