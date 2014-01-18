var config = require("./config"),
    logger = require("./lib/logger").init(config),
    listener = require("./lib/listener").init(config, logger),
    publisher = require("./lib/publisher").init(config, logger);
    parser = require("./lib/parser").init(config, logger, publisher);

logger.info("Setting up bridge...");
listener.sub(parser.parse);














