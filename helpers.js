var config = (process.env.MONGOLAB_URI) ? process.env.MONGOLAB_URI : require(__dirname + '/../config.js'),
   request = require('request'),
         _ = require('underscore'),
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

//Retrieve all module names from NPM & run a callback on them
var getAllNamesFromRegistry = module.exports.getAllNamesFromRegistry = function(cb) {
  request({
    url: 'https://skimdb.npmjs.com/registry/_all_docs',
    json: true
  }, function(err, res) {
    if (err) {
      console.log(err)
    } else {
      var names = [];
      var idNames = res.body["rows"];
      
      idNames.forEach(function(item) {
        names.push(item["id"]);
      })
      
      console.log('Successfully gets modules found on NPM', names.length);
      cb(names);
    }
  })
}

// function that runs when the database initializes
var databaseInit = module.exports.databaseInit = function() {
  getAllNamesFromRegistry(function(moduleArray){
    getAllNamesFromDb(moduleArray,function(collection, items) {
      var difference = _.difference(collection, items);
      console.log('Successfully gets the difference between NPM and Mongo', difference.length)
      var moduleArray = [];

      _.each(difference, function(item) {
        var module = { module: item, status: 'ready', lastUpdated: new Date()-1};
        moduleArray.push(module)
      });
      console.log(moduleArray.length)
      
      if (moduleArray.length > 0) {
        DB.collection('jobs').insertMany(moduleArray);
      }
    })

    // change all processes older than 48 hours to "ready"
    var t = new Date() - 172800000;

    // jobs.updateMany(
    //   { lastUpdated: { $lte: t } }, { $set: { status: "ready" } }, 
    //   function(err, results) { console.log(results); }
    // );
  })
}

//Retrieve all module names from Mongo & run a callback on them
var getAllNamesFromDb = module.exports.getAllNamesFromDb = function(arr, cb) {
  jobs.distinct('module',function(err, docs){
    console.log("Successfully gets names from Mongo")
    cb(arr, docs)
  });
}