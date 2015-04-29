UnitController = {
	createHero:function(user, callback){
		console.log("Create Hero");
		UnitModel.findOne({name:"Albert"}).exec(function(err, unit){
			var hero = new UserUnitModel();
			hero.model = unit._id;
			user.hero = hero._id;
			hero.save().then(function(){
				user.save(callback);
			});
		});
	},
	getRecruitableUnits:function(callback){
		UnitModel.find({type:"follower"}).populate('active_skills passive_skills').then(callback);
	},
	purchaseFollower:function(unit_id, price, user_id, callback){
		UserModel.findById(user_id, "followers gold", function(err, user){
			var follower = new UserUnitModel({model:unit_id});
			follower.save(function(){
				follower.populate('model', function(err, follower){
					follower.populate({path:'model.active_skills model.passive_skills', model:"Skill"}, function(err, follower){
						UserModel.update({_id:user_id},{$inc:{gold: -price}, $push:{'followers': follower._id}}, function(err, result){
							callback(err, result, follower);
						});
					});
				});
			});
		});
	}
}