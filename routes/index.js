var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, map){
		res.render('game', { title: 'Express', user:user, map:map});
	});
});

router.post('/', function(req, res) {
	if(!req.session.user_id){
		res.redirect('/');
	}else{
		var user_id = req.session.user_id;
		var act = req.body.act;
		var chapter = req.body.chapter;
		var difficulty_level = req.body.difficulty_level;
		UserController.loadStage(user_id, act, chapter, difficulty_level, res, function(user, map){
			res.render('game', { title: 'Express', user:user, map:map});
		});
	}
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
	var items = typeof req.body.items !== 'undefined' ? req.body.items : [];
	var user_id = req.session.user_id;
	ItemController.saveInventory(items, user_id, function(ret){
		res.send(ret);
	});
});

router.post('/sellitem', function(req, res){
	var gold = req.body.sell_price;
	var user_id = req.session.user_id;
	ItemController.addGold(gold, user_id, function(ret){
		res.send(ret);
	});
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

router.post('/saveequipitem', function(req, res){
	var hero_items = typeof req.body.hero_items !== 'undefined' ? req.body.hero_items : [];
	var follower_items = typeof req.body.follower_items !== 'undefined' ? req.body.follower_items : [];
	var user_id = req.session.user_id;
	UserController.saveItems(hero_items, follower_items, user_id, function(err, user){
		res.send("ok");
	});
})


router.get('/game', function(req, res) {
	res.render('game', { title: 'Express' });
});


module.exports = router;