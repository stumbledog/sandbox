UserController = {
	authenticate:function(req, res, callback){
		console.log("Authenticate user");
		if(req.session.user_id){
			console.log("Login by session: " + req.session.user_id);
			this.loginById(req.session.user_id, req, res, callback);
		}else if(req.cookies.user_id){
			console.log("Login by cookie: " + req.cookies.user_id);
			this.loginById(req.cookies.user_id, req, res, callback);
		}else{
			this.createUser(req, res, callback);
		}
	},
	createUser:function(req, res, callback){
		console.log("Create new user");
		var user = new UserModel();
		user.save(function(err, user){
			UnitController.createHero(user, function(hero){
				this.loginById(user._id, req, res, callback);
			}.bind(this));
		}.bind(this));
	},
	loginById:function(id, req, res, callback){
		UserModel.findById(id, function(err, user){
			if(user){
				console.log("Found matching user in db");
				user.last_logged_in = new Date();
				user.populate("hero.model hero.").execPopulate().then(function(user){
					return user
						.populate({path:"hero.model.active_skills",model:"ActiveSkill"})
						.populate({path:"hero.model.passive_skills",model:"PassiveSkill"})
						.execPopulate();
				}).then(function(user){
					req.session.user_id = user._id;
					res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
					MapController.loadBasecamp(user.hero.level, function(map){
						callback(user, map);
					});
				});
				/*
				user.save(function(err, user){
					//return user.populate({path:"hero.model", model:"Unit"}).execPopulate();
					return UserModel.populate(user, {path:"hero.model", model:"Unit"});
				}).then(function(model){
					console.log(model);
					return model.populate("hero.model.passive_skills").populate("hero.model.active_skills").execPopulate();
				}).then(function(foo){
					console.log(foo);
					user.hero.model = model;
					req.session.user_id = user._id;
					res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
					MapController.loadBasecamp(user.hero.level, function(map){
						callback(user, map);
					});
				});*/
			}else{
				console.log("No matching data found in db");
				this.createUser(req, res, callback);
			}
		}.bind(this));
	},
	loadStage:function(user_id, act, chapter, res, callback){
		UserModel.findById(user_id, function(err, user){
			if(err || !user){
				res.redirect('/');
			}else{
				MapController.loadMap(act, chapter, function(err, map){
					callback(user, map);
				});				
			}
		});
	},
	saveItems:function(hero_items, follower_items, user_id, callback){
		UserModel.findById(user_id, function(err, user){
			user.hero.items = hero_items;

			if(follower_items.length === 0){
				user.followers.forEach(function(follower){
					follower.items = [];
				});
			}else{
				follower_items.forEach(function(items, follower_index){
					user.followers[follower_index].items = items;
				});
			}

			user.markModified('hero.items');
			user.markModified('followers');
			user.save(callback);
		});
	},
	saveStats:function(hero, followers, user_id, callback){
		UserModel.findById(user_id, function(err, user){
			user.hero.level = hero.level;
			user.hero.exp = hero.exp;
			user.hero.strength = user.hero.level_up_bonus.strength * hero.level;
			user.hero.agility = user.hero.level_up_bonus.agility * hero.level;
			user.hero.intelligence = user.hero.level_up_bonus.intelligence * hero.level;
			user.hero.stamina = user.hero.level_up_bonus.stamina * hero.level;

			followers.forEach(function(follower, follower_index){
				user.followers[follower_index].level = follower.level;
				user.followers[follower_index].exp = follower.exp;
				user.followers[follower_index].strength = user.followers[follower_index].level_up_bonus.strength * follower.level;
				user.followers[follower_index].agility = user.followers[follower_index].level_up_bonus.agility * follower.level;
				user.followers[follower_index].intelligence = user.followers[follower_index].level_up_bonus.intelligence * follower.level;
				user.followers[follower_index].stamina = user.followers[follower_index].level_up_bonus.stamina * follower.level;
			});

			user.markModified('hero.level');
			user.markModified('hero.exp');
			user.markModified('hero.strength');
			user.markModified('hero.agility');
			user.markModified('hero.intelligence');
			user.markModified('hero.stamina');
			user.markModified('followers');

			user.save(callback);
		})
	}
};