var config = (process.env.MONGOLAB_URI) ? process.env.MONGOLAB_URI : require(__dirname + '/../config.js');
var helpers = require(__dirname + '/../helpers.js')
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI || config.mongodb;
var DB;

// //input : [name1, name2] ..
// helpers.getAllNamesFromRegistry().then(function(resultsArray){
// 	console.log('array',resultsArray);
// 	// {module: 'angular', status: 'ready', lastUpdated: 'timestamp'}
// 	for (var i = 0; i < resultsArray.length; i++){
// 		var ts = new Timestamp();
// 		var current = {module: resultsArray[i], status: 'ready', lastUpdated: ts};
// 		//add data to current
// 		DB.collection('jobs').insert(current)
// 	}
// })

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;