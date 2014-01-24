var utils = require('../lib/utils').init();

var ConsoleBackend = function (config, events, logger){
	var self = this;
	this.config = config;
	this.logger = logger;
	events.on('data', function(topic, message){
		self.process(topic, message);
	});
	events.on('flush', function(callback){
		self.flush(callback);
	});
	logger.info("Console backend created %j", config);
};

ConsoleBackend.prototype.process = function(topic, message) {
	var self = this;
	var cleanTopic = utils.replaceAll("/", ":", topic);
	self.logger.debug("[%s] %s > %s", self.config.index, cleanTopic, message);
};

ConsoleBackend.prototype.flush = function(callback) {
	var self = this;
	self.logger.debug("No messages to flush");
	callback();
};

exports.init = function(config, events, logger) {
  var backendInstance = new ConsoleBackend(config, events, logger);
  return true;
}; 
