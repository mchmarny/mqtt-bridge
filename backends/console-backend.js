function ConsoleBackend(config, logger){
 	var me = this;
 	me.config = config;
  	me.logger = logger;
	me.logger.info("Console publisher created");
	me.subcribe = function(topic, message) {
	  logger.debug("topic:%s message:%s ", topic, message);
	  var doc = JSON.parse(message);
	};

};

exports.init = function(config, logger) {
  return new ConsoleBackend(config, logger);
}; 


