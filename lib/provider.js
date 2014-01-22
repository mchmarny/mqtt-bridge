var mqtt = require('mqtt');

/*
	Basic MQTT Broker implementation 
*/
var MqttMessageEmitter = function (config, logger){
	var me = this;
	me.config = config;
	me.logger = logger;
	me.broker = null;
	me.handlers = [];

	if (config.mqtt.secure){
		logger.info("Creating secure MQTT subscription...");
		me.broker = mqtt.createSecureClient(config.mqtt.port, 
														config.mqtt.host,
														config.mqtt.args);
	}else{
		logger.info("Creating basic MQTT subscription...");
		me.broker = mqtt.createClient(config.mqtt.port, 
			  									config.mqtt.host,
												config.mqtt.args);		
	}
  
	logger.info("MQTT subscription created [%s:%s] ", 
  		config.mqtt.host, config.mqtt.port);

};

exports.init = function(config, logger) {
  return new MqttMessageEmitter(config, logger);
};