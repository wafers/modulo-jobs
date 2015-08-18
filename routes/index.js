var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI || config.MONGOLAB_URI;
var DB;

MongoClient.connect(url, function(err, db) {
  console.log('Correctly connects to the database');
  DB = db;
})

//input : [name1, name2] ..
getAllNamesFromRegistry().then(function(resultsArray){
	console.log('array',resultsArray);
	// {module: 'angular', status: 'ready', lastUpdated: 'timestamp'}
	for (var i = 0; i < resultsArray.length; i++){
		var current = {module: resultsArray[i], status: 'ready'};
		//add data to current
		DB.collection('jobs').insert(current)
	}
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;