var config = require(__dirname + '/../config.js'),
   helpers = require(__dirname + '/../helpers.js'),
   express = require('express'),
    router = express.Router(),
MongoClient = require('mongodb').MongoClient,
       url = process.env.MONGOLAB_URI || config.mongodb,
  DB, jobs;

MongoClient.connect(url, function(err, db) {
  if (err) {
  	console.log(err);
  } else {
    console.log('Correctly connects to the database');
    DB = db;
    jobs = DB.collection('jobs');
  }
})

router.get('/', function(req, res, next) {
  var job, moduleName;

  jobs.findOne({status: "new"}, function(err, data) {
		if (err) {
			jobs.findOne({status: "ready"}, function(err, data) {
				if (err) return res.send(err)
				moduleName = data.module;
				res.json({module: moduleName});
				jobs.findAndModify({ module: moduleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) { console.log(err, doc); });	
			});
		} else {
			moduleName = data.module;
			res.json({module: moduleName});
			jobs.findAndModify({ module: moduleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) { console.log(err, doc); });				
		}
	});
});

router.post('/', function(req, res, next) {
  var moduleName = req.body.module;

  jobs.findAndModify({ module: moduleName }, [], { $set: { status: "done", lastUpdated: new Date()-1 } }, { new: true }, function(err, doc) { console.log(err, doc); });

  jobs.findOne({status: "new"}, function(err, data) {
		if (err) {
			jobs.findOne({status: "ready"}, function(err, data) {
				if (err) return res.send(200)
				moduleName = data.module;
			  res.status(201);
				res.json({module: moduleName});
				jobs.findAndModify({ module: moduleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) { console.log(err, doc); });
			});
		} else {
			res.status(201);
			moduleName = data.module;
			res.json({module: moduleName});
			jobs.findAndModify({ module: moduleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) { console.log(err, doc); });				
		}
	});
});

module.exports = router;