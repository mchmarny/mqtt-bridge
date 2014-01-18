

function SimpleParser(config, logger, publisher){
	var me = this;
	me.config = config;
	me.logger = logger;
	me.publisher = publisher;
  
	logger.info("Parser created");
};

SimpleParser.prototype.parse = function(topic, message) {
  var me = this;
  logger.info("Parsing topic:%s message:%s ", topic, message);

  // Increment topic message count by 1
  me.publisher.count(topic);

  //TODO: Parse message
  //      Demo set and bulkSet

};


exports.init = function(config, logger, publisher) {
  return new SimpleParser(config, logger, publisher);
}; 


