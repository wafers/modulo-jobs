var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	//This should search through the database and find the next job to provide
	//based on this criteria:
	//1: Are there any nodes with the state of "New".
	//2: Are there any nodes that have not been updated in 48 hours?

  res.send('respond with a resource');
});

module.exports = router;
