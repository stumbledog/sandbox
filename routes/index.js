var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, hero, units, map){
		res.render('game', { title: 'Express', user:user, hero:hero, units:units, map:map});
	});
});

router.get('/inventory', function(req, res) {
	var inventory = new InventoryModel();
	inventory.number_of_slots = 100;
	inventory.slots = [];
	inventory.save(function(err, inv){
		console.log(inv);
	});
});


router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;