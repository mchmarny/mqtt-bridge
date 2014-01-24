/*

	Requires rethinkdb
	http://rethinkdb.com/docs/install-drivers/javascript/

	Either one will do:
		npm install rethinkdb
		
*/

var utils = require('../lib/utils').init(),
    r = require('rethinkdb');


var RethinkDbBackend = function (config, events, logger){
	var self = this;
	self.config = config;
	self.logger = logger;
	self.dbName = config.config.db || "test";
	self.tableName = config.config.table || "messages";

	var connOpt = config.config.conn || {};

	r.connect(connOpt, function(err, conn) {
	  if(err) throw err;
	  self.db = r.db(self.dbName);
	  self.db.tableCreate(self.tableName).run(conn, function(err, res) {
	    if(err) throw err;
	    self.logger.debug("Table create result", res);
	    events.on('data', function(topic, data){
		 	self.save(self.db, topic, data);
		 });
	  });
	});
	
	logger.info("Statsd backend created %j", config);
};

RethinkDbBackend.prototype.save = function(conn, topic, data) {
	if (!topic || !data) return;
	var self = this;
	
	var doc = {
		on: new Date(),
		topic: topic,
		content: data
	};

	self.logger.debug("[%s]", self.config.index, doc);

	r.table(self.tableName)
	 .insert(doc)
	 .run(conn, function(err, res){
      if(err) self.logger.error(err);
      else self.logger.debug(res);
    });

};

exports.init = function(config, events, logger) {
  var backendInstance = new RethinkDbBackend(config, events, logger);
  return true;
}; 
