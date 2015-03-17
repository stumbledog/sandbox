var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, hero, units, map){
		res.render('game', { title: 'Express', user:user, hero:hero, units:units, map:map});
	});
});

router.post('/purchaseitem', function(req, res){
	var item = req.body.item;
	var user_id = req.session.user_id;
	ItemController.purchase(item, user_id, function(err){
		if(err){
			res.send(err);
		}else{
			res.send("Purchased item successfully.");
		}
	});
});

router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;