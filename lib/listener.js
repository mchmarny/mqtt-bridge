var mqtt = require('mqtt');

/*
	Basic MQTT Broker implementation 
*/
function MqttSubscriber(config, logger){
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

/*
	Subscribe handler to message events on the broker
*/
MqttSubscriber.prototype.sub = function(handler) {
  	var me = this;
  	me.broker.subscribe(me.config.mqtt.topic)
  	         .on('message', handler);
};

exports.init = function(config, logger) {
  return new MqttSubscriber(config, logger);
};