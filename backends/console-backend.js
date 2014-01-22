function ConsoleBackend(config, logger){
 	var me = this;
 	me.config = config;
  	me.logger = logger;
	me.logger.info("Console publisher created");

};

ConsoleBackend.prototype.process = function(topic, message) {
  var me = this;
  me.logger.debug("topic:%s message:%s ", topic, message);
};

exports.init = function(config, logger) {
  return new ConsoleBackend(config, logger);
}; 


