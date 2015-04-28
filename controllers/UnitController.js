UnitController = {
	getUnitsByUserId:function(user_id, callback){
		console.log("Load units by user id");
		UnitModel.find({_user:user_id}, callback);
	},
	loadRecruitableUnit:function(level, callback){
		var units = [];
		FollowerModel.find().exec(function(err, followers){
			followers.forEach(function(follower){
				units.push(follower.setRecruitableFollower(level));
			});
			callback(err, units);
		});
	},
	createHero:function(user, callback){
		console.log("Create Hero");
		UnitModel.findOne({name:"Albert"}).exec(function(err, unit){
			user.hero.model = unit._id;
			return user.save(function(){
				callback(user);	
			});
		});
			/*
			return user.populate("hero.model").execPopulate();
		}).then(function(model){
			return model.populate("passive_skills").populate("active_skills").execPopulate();
		}).then(function(model){
			user.hero.model = model;
			callback(user.hero);
		});*/
	},
	getRecruitableUnit:function(){

	},
	purchaseFollower:function(unit, user_id, callback){
		unit.active_skills.forEach(function(skill){
			if(skill.name === "Leap Attack"){
				skill.animation.jump.images = skill.animation.jump.images["[]"];
				skill.animation.land.images = skill.animation.land.images["[]"];
			}
		});

		unit.exp = 0;
		UserModel.findById(user_id, function(err, user){
			user.followers.push(unit);
			user.gold -= unit.price;
			user.markModified('followers');
			user.save(callback);
		});
	}
}