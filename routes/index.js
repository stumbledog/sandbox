var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, units){
		res.render('index', { title: 'Express', user:user, units:units });
	});
});

router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;