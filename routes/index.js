var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, hero, map){
		res.render('game', { title: 'Express', user:user, hero:hero, map:map});
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

router.post('/saveinventory', function(req, res){
	var items = req.body.items;
	var user_id = req.session.user_id;
	ItemController.saveInventory(items, user_id, function(ret){
		res.send(ret);
	});
});

router.post('/sellitem', function(req, res){
	var item_id = req.body.item_id;
	var user_id = req.session.user_id;
	ItemController.sellItem(item_id, user_id, function(ret){
		res.send(ret);
	})
});

router.post('/purchasefollower', function(req, res){
	var unit = req.body.unit;
	var user_id = req.session.user_id;
	UnitController.purchaseFollower(unit, user_id, function(err, user){
		if(err){

		}else{
			res.send("Purchased unit successfully.");
		}
	})
});


router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;