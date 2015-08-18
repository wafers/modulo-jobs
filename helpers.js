var request = require('request');

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