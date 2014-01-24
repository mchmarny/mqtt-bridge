/*

	Requires redis
	https://github.com/mranney/node_redis

	Either one will do:
		npm install redis
		npm install hiredis redis (C)
		
*/

var utils = require('../lib/utils').init(),
    redis = require("redis");


var RedisBackend = function (config, events, logger){
	var self = this;
	this.config = config;
	this.logger = logger;
	this.keyPrefix = config.config.prefix || "message";

	var host = config.config.host || "127.0.0.1";
	var port = config.config.port || 6379;
	var options = config.config.options || {};

	var client = redis.createClient(port, host, options);
	client.on("error", function (err) {
        logger.error("Redis Error ", err);
   });

	this.client = client;

	events.on('data', function(topic, data){
		self.save(topic, data);
	});
	
	logger.info("Redis backend created %j", config);
};

RedisBackend.prototype.save = function(topic, data) {
	if (!topic || !data) return;
	var self = this;
	var cleanTopic = utils.replaceAll("/", "-", topic);
	var key = this.keyPrefix + ":" + cleanTopic + ":" + (new Date).getTime(); 
	self.logger.debug("[%s] %s > %s", self.config.index, cleanTopic, data);
	self.client.set(key, data.toString(), redis.print);
};

exports.init = function(config, events, logger) {
  var backendInstance = new RedisBackend(config, events, logger);
  return true;
}; 
