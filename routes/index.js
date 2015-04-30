var express = require('express');
var router = express.Router();

/* GET home page. */
/*
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, map){
		res.render('game', { title: 'Express', user:user, map:map, difficulty_level:0});
	});
});
*/
router.get('/', function(req, res) {
	UserController.authenticate(req, res, function(user, map){
		UnitController.getRecruitableUnits(function(recruitable_units){
			map.recruitable_units = recruitable_units;
			res.render('game', { title: 'Condottiere', user:user, map:map, difficulty_level:0});
		});
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
		UserController.loadStage(user_id, act, chapter, res, function(user, map){
			res.render('game', { title: 'Condottiere', user:user, map:map, difficulty_level:difficulty_level});
		});
	}
});

router.post('/purchaseitem', function(req, res){
	var item = req.body.item;
	var slot_index = req.body.slot_index;
	var repurchase = (req.body.repurchase === "true");
	var user_id = req.session.user_id;
	ItemController.purchase(item, slot_index, repurchase, user_id, function(err){
		if(err){
			res.send(err);
		}else{
			res.send("Purchased item successfully.");
		}
	});
});

router.post('/moveitem', function(req, res){
	var from = parseInt(req.body.from);
	var to = parseInt(req.body.to);
	var user_id = req.session.user_id;
	ItemController.moveItem(from, to, user_id, function(inventory){
		res.send(inventory);
	});
});

router.post('/saveinventory', function(req, res){
	var items = typeof req.body.items !== 'undefined' ? req.body.items : [];
	var user_id = req.session.user_id;
	ItemController.saveInventory(items, user_id, function(err, result){
		res.send({err:err, result:result});
	});
});

router.post('/saveunititem', function(req, res){
	var items = typeof req.body.items !== 'undefined' ? req.body.items : [];
	var unit_id = req.body.unit_id;
	UserUnitModel.update({_id:unit_id},{equipments:items}, function(err, result){
		res.send({err:err, result:result});
	});
});

router.post('/sellitem', function(req, res){
	var slot_index = parseInt(req.body.slot_index);
	var price = parseInt(req.body.price);
	var user_id = req.session.user_id;
	ItemController.sellItem(slot_index, price,user_id, function(err, result){
		res.send({err:err, result:result});
	});
});

router.post('/purchasefollower', function(req, res){
	var unit_id = req.body.unit_id;
	var price = parseInt(req.body.price);
	var user_id = req.session.user_id;
	UnitController.purchaseFollower(unit_id, price, user_id, function(err, result, follower){
		res.send({err:err, result:result, follower:follower});
	})
});

router.post('/savestats', function(req, res){
	var units = req.body.units;
	var user_id = req.session.user_id;
	UserController.saveStats(units, user_id, function(errs, results){
		res.send({errs:errs, results:results});
	});
});

router.post('/dropitem', function(req, res){
	var level = req.body.level;
	var rating = req.body.rating;
	ItemController.dropItem(level, rating, function(item){
		res.send(item);
	});
});

router.post('/lootitem', function(req, res){
	var item = req.body.item;
	console.log(item);
	ItemController.lootItem(item, function(err, item_model){
		res.send({err:err, item_model:item_model});
	});
});

router.post('/setgold', function(req, res){
	var gold = req.body.gold;
	var user_id = req.session.user_id;
	UserModel.findByIdAndUpdate(user_id,{gold:gold}, function(err, user){
		res.send({gold:user.gold});
	});
});

module.exports = router;