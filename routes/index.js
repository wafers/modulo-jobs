var config = require(__dirname + '/../config.js'),
   helpers = require(__dirname + '/../helpers.js'),
   express = require('express'),
    router = express.Router(),
MongoClient = require('mongodb').MongoClient,
       url = process.env.MONGOLAB_URI || config.mongodb,
  DB, jobs;

MongoClient.connect(url, function(err, db) {
 if(err) console.log(err)
 console.log('Correctly connects to the database');
 DB = db;
 jobs = DB.collection('jobs');
})

router.get('/', function(req, res, next) {

  // if - else returns a single module name where either new or ready
  
  res.json({module: moduleName})
  // if success, change to in progress
});

router.post('/', function(req, res, next) {
	// worker posts that job was successfully completed, and change state to "Done" and update the timestamp

});

module.exports = router;