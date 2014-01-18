var TempoDBClient = require('tempodb').TempoDBClient;

function TempoDBPBackend(config, logger){
 	var me = this;
  	me.logger = logger;
  	me.config = config;
	me.client = new TempoDBClient(conf.tempo.key, 
		                           conf.tempo.secret,
		                           conf.tempo.args);
	me.handler = function(result){ 
		logger.debug("%s:%j", result.response, result.body); 
	}
	logger.info("TempDB publisher created");
};


/*
	data = [
	    { t: date, id: "123456", v: 14.3654 },
	    { t: date, id: "789123", v: 27.234 },
	    { t: date, key: "ABCD-EFGH", v: 1 },
	    { t: date, key: "1A2B3C4D5", v: 34.654 },
	];
*/
TempoDBPBackend.prototype.count = function(data) {
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
TempoDBPBackend.prototype.set = function(data, at) {
  	var me = this;
  	var ts = at || new Date();
  	me.lgger.debug("%s:%j", ts, data);
  	me.client.write_bulk(ts, data, me.handler);
};

exports.init = function(config, logger) {
  return new TempoDBPBackend(config, logger);
}; 


