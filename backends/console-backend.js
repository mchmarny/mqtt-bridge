function ConsoleBackend(config, logger){
 	var me = this;
  	me.logger = logger;
  	me.config = config;
	logger.info("Console publisher created");
};


/*
	data = [
	    { t: date, id: "6fefeba655504694b21235acf8cdae5f", v: 14.3654 },
	    { t: date, id: "01868c1a2aaf416ea6cd8edd65e7a4b8", v: 27.234 },
	    { t: date, key: "your-custom-key", v: 1 },
	    { t: date, key: "your-custom-key-2", v: 34.654 },
	];
*/
ConsoleBackend.prototype.count = function(data) {
  	var me = this;
  	for (i=0; i<date.length;i++){
  		me.lgger.info(data[i]);
  	}
};


/*
	data = [
	    { id: "6fefeba655504694b21235acf8cdae5f", v: 14.3654 },
	    { key: "your-custom-key", v: 1 },
	]
*/
ConsoleBackend.prototype.set = function(data, at) {
  	var me = this;
  	for (i=0; i<date.length;i++){
  		me.lgger.info(data[i]);
  	}
};

exports.init = function(config, logger) {
  return new ConsoleBackend(config, logger);
}; 


