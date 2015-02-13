var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: 'Express' });
	UserController.authenticate(req, res, function(){
		console.log("authenticate");
	});
});

router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;