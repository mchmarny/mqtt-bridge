var config = require("./config"),
    logger = require("./lib/logger").init(config),
    listener = require("./lib/listener").init(config, logger);

logger.info("Setting up backends");
config.backends.forEach(function (item) {
	logger.info("Loading:", item);
	listener.sub(require(item.backend)
						.init(item.config, logger)
						.subcribe);
});













