var util = require('util'),
	 mqtt = require('mqtt'),
	 EventEmitter = require('events').EventEmitter;

var MqttMessageEmitter = function (topic, config, logger){
	
	var self = this;
	    self.logger = logger;
	var broker = null;

	if (config.mqtt.secure){
	     logger.info("Creating secure MQTT subscription...");
	     broker = mqtt.createSecureClient(config.mqtt.port, 
	                                      config.mqtt.host,
	                                      config.mqtt.args);
	}else{
	     logger.info("Creating basic MQTT subscription...");
	     broker = mqtt.createClient(config.mqtt.port, 
	                                config.mqtt.host,
	                                config.mqtt.args);                
	}

	logger.info("MQTT subscription created [%s:%s] ", 
	         config.mqtt.host, config.mqtt.port);

	broker.subscribe(topic)
	      .on('message', function(resultTopic, message){
		self.logger.info("Message %s > %s ", topic, resultTopic);
		self.emit(topic, resultTopic, message);
	}); 

};

util.inherits(MqttMessageEmitter, EventEmitter);


exports.init = function(topic, config, logger) {
  return new MqttMessageEmitter(topic, config, logger);
};

