var config = require(__dirname + '/config.js')
var request = require('request');
var _ = require('underscore')
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI || config.mongodb;
var DB;
var jobs

MongoClient.connect(url, function(err, db) {
    if(err) console.log(err)
    console.log('Correctly connects to the database');
    DB = db;
    jobs = DB.collection('jobs');
})



var Timestamp = mongo.Timestamp;


var getAllNamesFromRegistry = module.exports.getAllNamesFromRegistry = function(cb) {
  //Retrieve all module names from the registry,
  // and run a callback function on them
    request({
        url: 'https://skimdb.npmjs.com/registry/_all_docs',
        json: true
    }, function(err, res) {
        if (err) console.log(err)
            // var jsonResponse = res.body
        var names = []
        var idNames = res.body["rows"]
        idNames.forEach(function(item) {
            names.push(item["id"])
        })
        console.log(names.length, 'modules found');
        cb(names);
    })
}

var databaseInit = module.exports.databaseInit = function() {
  //Retrieve all module names from the registry,
  // and run a callback function on them
  getAllNamesFromRegistry(function(moduleArray){
    // console.log('array',resultsArray);
    // {module: 'angular', status: 'ready', lastUpdated: 'timestamp'}
    getAllNamesFromDb(moduleArray,function(collection,items){
        console.log("Getting Diff")
        console.log(_.difference(collection,items))
    })

    // for (var i = 0; i < resultsArray.length; i++){
    //     var ts = new Timestamp();
    //     var current = {module: resultsArray[i], status: 'ready', lastUpdated: ts};
    //     //add data to current
    //     DB.collection('jobs').insert(current)
    // }
  })
}

var getAllNamesFromDb = module.exports.getAllNamesFromDb = function(moduleArray,cb) {

    // jobs.find().toArray(function(err, docs) {
    //     var cleanArray = []
    //     docs.forEach(function(item){
    //         cleanArray.push(item.module)
    //     })

    //     // cb(moduleArray,cleanArray)
    // });
    jobs.distinct('module',function(err,docs){
        console.log(docs)
    })
}