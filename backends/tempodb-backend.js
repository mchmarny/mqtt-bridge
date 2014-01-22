/*
	Requires tempodb 

	npm install tempodb
*/

var TempoDbClient = require('tempodb').TempoDBClient;

function TempoDbBackend(config, logger){
 	var me = this;
  	me.logger = logger;
  	me.config = config;
	me.client = new TempoDbClient(config.key, 
		                           config.secret,
		                           config.args);
	me.handler = function(result){ 
		logger.debug("%s:%j", result.response, result.body); 
	}
	logger.info("TempDB publisher created");
};

TempoDbBackend.prototype.process = function(topic, message) {
  var me = this;
  me.logger.info("Parsing topic:%s message:%s ", topic, message);

  // Increment topic message count by 1
  me.count(topic);

  //TODO: Parse message
  //      Demo set and bulkSet

};


/*
	data = [
	    { t: date, id: "123456", v: 14.3654 },
	    { t: date, id: "789123", v: 27.234 },
	    { t: date, key: "ABCD-EFGH", v: 1 },
	    { t: date, key: "1A2B3C4D5", v: 34.654 },
	];
*/
TempoDbBackend.prototype.count = function(data) {
  	var me = this;
  	me.lgger.debug(data);
  	me.client.increment_multi(data, me.handler);
};

/*
	data = [
	    { id: "6fefeba655504694b21235acf8cdae5f", v: 14.3654 },
	    { key: "your-custom-key", v: 1 },
	]
*/
TempoDbBackend.prototype.set = function(data, at) {
  	var me = this;
  	var ts = at || new Date();
  	me.lgger.debug("%s:%j", ts, data);
  	me.client.write_bulk(ts, data, me.handler);
};

exports.init = function(config, logger) {
  return new TempoDbBackend(config, logger);
}; 


