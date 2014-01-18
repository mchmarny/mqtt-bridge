var mqtt = require('mqtt');

function MqttSubscriber(config, logger){
	var me = this;
	me.config = config;
	me.logger = logger;
	me.broker = null;

	if (conf.mqtt.secure){
		me.broker = mqtt.createSecureClient(conf.mqtt.port, 
														conf.mqtt.host,
														conf.mqtt.args);
	}else{
		me.broker = mqtt.createClient(conf.mqtt.port, 
			  									conf.mqtt.host,
												conf.mqtt.args);		
	}
  
	logger.info("MQTT listener created %s:%s: ", 
  		conf.mqtt.host, conf.mqtt.port);
};

TempoDBPoblisher.prototype.sub = function(handler) {
  var me = this;
  me.broker.subscribe(me.conf.mqtt.topic).on('message', handler);
  logger.info("MQTT topic subscribed %s ", me.conf.mqtt.topic);
};


exports.init = function(config, logger) {
  return new TempoDBPoblisher(config, logger);
}; 


