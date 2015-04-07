UnitController = {
	getUnitsByUserId:function(user_id, callback){
		console.log("Load units by user id");
		UnitModel.find({_user:user_id}, callback);
	},
	loadRecruitableUnit:function(level, callback){
		var units = [];
		PrototypeFollowerModel.find().exec(function(err, prototype_followers){
			prototype_followers.forEach(function(prototype_follower){
				units.push(prototype_follower.setRecruitableFollower(level));
			});
			callback(err, units);
		});
	},
	createHero:function(user, callback){
		console.log("Create Hero");
		PrototypeHeroModel.findOne({name:"Albert"}, function(err, prototype_hero){
			prototype_hero.initHero(function(hero){
				console.log(hero);
				user.hero = hero;
				user.save(function(){
					callback(hero);
				});
			}.bind(this));
		}.bind(this));
	},
	getRecruitableUnit:function(){

	},
	purchaseFollower:function(unit, user_id, callback){
		console.log(unit);
		unit.exp = 0;
		console.log(user_id);
		UserModel.findById(user_id, function(err, user){
			user.followers.push(unit);
			user.markModified('followers');
			user.save(callback);
		});
	}
}