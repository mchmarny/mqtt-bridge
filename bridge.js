var mqtt = require('mqtt'),
	 events = require('events'),
	 backendEvents = new events.EventEmitter(),
	 config = require("./config"),
    logger = require("./lib/logger").init(config);

// local variables 
var broker = null;

function loadBackend(backend){
   logger.info("Loading: %s", backend.handler);
   var Backend = require(backend.handler);
   var handler = Backend.init(backend, backendEvents, logger);
   if (!handler) {
   	logger.error("Failed to load backend: ", backend);
    	process.exit(1);
   }
};

function initBroker(){
	logger.info("Initializing MQTT broker [%s:%s] ", 
  		config.mqtt.host, config.mqtt.port);
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

   broker.subscribe(config.mqtt.topic)
	      .on("message", function(topic, message){
		logger.info("Message for: ", topic);
		backendEvents.emit("data", topic, message);
	}); 

	logger.info("MQTT broker initialized");
};

function flushBackends(){
	// flush the backends in case they buffering 
	// this is to prevent message lose 
	backendEvents.emit("flush", function(){
		logger.info("Done");
	});
}


// start here
initBroker();

logger.info("Loading backends");
if (config.backends) {
	config.backends.forEach(function (backend, index) {
		// add index to each backend for debugging purposes 
		backend.index = index;
		loadBackend(backend);
	});
}else{
	logger.error("Backends not defined");
   process.exit(1);
};

process.on('uncaughtException', function(err) {
  logger.error('Uncaught Exception:', err);
  flushBackends();
});

process.on('exit', function () {
	flushBackends();
});


