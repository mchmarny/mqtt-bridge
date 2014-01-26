/*

	Requires rethinkdb
	http://rethinkdb.com/docs/install-drivers/javascript/

	Either one will do:
		npm install rethinkdb

	Config

		"handler": "./backends/rethinkdb-backend.js",
		"config": {
			"host": "127.0.0.1",
			"port": 28015,
			"db": "mqtt",
			"table": "messages"
		}
		
*/

var utils = require('../lib/utils').init(),
    r = require('rethinkdb');


var RethinkDbBackend = function (config, events, logger){
	var self = this;
	self.config = config;
	self.logger = logger;
	self.dbName = config.config.conn.db || "test";
	self.tableName = config.config.conn.table || "messages";
	self.connOpt = config.config.conn || {};
	self.conn = null;
	self.connect = function(callback){
		if (self.conn){
			callback(null, self.conn);
			return;
		}

		logger.debug("rethinkDb connecting...");
		r.connect(self.connOpt, function(err, conn) {
	   	if(err) {
		 		logger.error("Error on connect: ", err);
		 		callback(err);
	    	}else{
	    		self.conn = conn;
	    		conn['_id'] = Math.floor(Math.random()*10001);
	    		logger.debug("Connected: ", conn['_id']);
	    		callback(null, conn);
	    	}
		});
	};

	events.on('data', function(topic, data){
		self.save(topic, data);
	});

	logger.info("rethinkDb backend created %j", config);
};

RethinkDbBackend.prototype.save = function(topic, data) {
	var self = this;
	
	if (!topic || !data) {
		logger.error("Null argument: T:%s > ", topic, data);
	}
	
	var doc = {
		on: new Date(),
		topic: topic,
		topic_parts: topic.split("/"),
		content: data
	};

	self.logger.debug("[%s]", self.config.index, doc);

	self.connect(function(err, conn){
		r.table(self.tableName)
		 .insert(doc)
		 .run(conn, function(err, res){
	      if(err) self.logger.error(err);
	      else self.logger.debug(res);
	    });
	});

};

exports.init = function(config, events, logger) {
  var backendInstance = new RethinkDbBackend(config, events, logger);
  return true;
}; 
