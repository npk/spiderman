var mongo = require('mongodb');
var async = require('async');

function MongodbAdaptor(config, performSegue) {
	this.config = config;
	this.dbConfig = config.dbConfig;
	this.performSegue = performSegue;
	this.db = new mongo.Db(this.dbConfig.db, new mongo.Server(this.dbConfig.host, this.dbConfig.port, {
		auto_reconnect: true
	}));
	this.db.open(function(err, db) {
		// throw err
	});
}

MongodbAdaptor.prototype.process = function(data,cb) {
	this.db.collection(this.dbConfig.collection, {
		safe: true
	}, function(err, collection) {
		if (err) throw err;
		collection.insert(data, {
			safe: true
		}, function(err, result) {
			if (err) throw err;
			var msg = 'insert data: ' + JSON.stringify(data);
			console.log(msg);
			process.send && process.send(msg);
		});
	});
}

module.exports = MongodbAdaptor;