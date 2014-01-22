var config = require("./config"),
    logger = require("./lib/logger").init(config),
    provider = require("./lib/provider").init(config, logger);


logger.info("Loading backends");
config.backends.forEach(function (backend) {

	//TODO: validate
	logger.info("Loading:", backend);
	var handler = require(backend.handler).init(backend.config, logger);

	logger.info("Subscribing:", backend.topic);
	provider.broker.subscribe(backend.topic)
	  	            .on('message', handler.process); 	
	logger.info("Subscribed: %s in %s", backend.topic, backend.handler);         

});
