var config = (process.env.MONGOLAB_URI) ? process.env.MONGOLAB_URI : require(__dirname + '/../config.js'),
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
        jobs.findOne({status: "ready"}, function(err, data) {
            if (err) return res.send(err)
            moduleName = data.module;
            res.json({module: moduleName});
            jobs.findAndModify({ module: moduleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) { 
                if(err){
                  console.log(err)
              } else{
                console.log("Sent out module ", doc.value.module);
              });
        });
});

router.post('/', function(req, res, next) {
  var moduleName = req.body.module;

    jobs.findAndModify({ module: moduleName }, [], { $set: { status: "done", lastUpdated: new Date()-1 } }, { new: true }, function(err, doc) {
        if(err){
            console.log(err)
        }else{
            console.log("Set ", moduleName,"to 'done'.")
            jobs.findOne({status: "ready"}, function(err, data) {
                if (err) {
                     res.json(err)
                }else{
                var newModuleName = data.module;
                jobs.findAndModify({ module: newModuleName }, [], { $set: { status: "in progress" } }, { new: true }, function(err, doc) {
                        if(err){
                            console.log(err)
                        }else{
                            res.json({module: newModuleName});
                            console.log("Sent out module ", newModuleName); 
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;
