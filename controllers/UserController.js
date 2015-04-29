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
			UnitController.createHero(user, function(err, user){
				if(err){
					console.log("error occurred while creating hero");
					console.log(err);
				}
				this.loginById(user._id, req, res, callback);
			}.bind(this));
		}.bind(this));
	},
	loginById:function(id, req, res, callback){
		UserModel.findById(id, function(err, user){
			if(user){
				console.log("Found matching user in db");
				user.last_logged_in = new Date();
				user.save(function(){
					this.populateUserModel(user, function(user){
						req.session.user_id = user._id;
						res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
						MapController.loadBasecamp(user.hero.level, function(map){
							callback(user.toObject(), map.toObject());
						});
					});
				}.bind(this));
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
				this.populateUserModel(user, function(user){
					MapController.loadMap(act, chapter, function(err, map){
						callback(user, map);
					});
				})
			}
		}.bind(this));
	},
	populateUserModel:function(user, callback){
		user.populate("hero followers").execPopulate().then(function(user){
			return user
			.populate({path:"hero.model followers.model",model:"Unit"})
			.populate({path:"inventory.slots.weapon hero.equipments.weapon followers.equipments.weapon",model:"Weapon"})
			.populate({path:"inventory.slots.armor hero.equipments.armor followers.equipments.armor",model:"Armor"})
			.execPopulate();
		}).then(function(user){
			return user
			.populate({path:"hero.model.passive_skills hero.model.active_skills",model:"Skill"})
			.populate({path:"followers.model.passive_skills followers.model.active_skills",model:"Skill"})
			.execPopulate();
		}).then(function(user){
			callback(user);
		});
	},
	saveStats:function(units, user_id, callback){
		var count = 0;
		var errs = [];
		var results = []
		units.forEach(function(unit){
			UserUnitModel.update({_id:unit._id},{level:unit.level,exp:unit.exp}, function(err, result){
				errs.push(err);
				results.push(result);
				count++;
				if(count == units.length){
					callback(errs, results)
				}
			})
		});
/*
			user.hero.level = hero.level;
			user.hero.exp = hero.exp;
			followers.forEach(function(follower, follower_index){
				user.followers[follower_index].level = follower.level;
				user.followers[follower_index].exp = follower.exp;
				user.followers[follower_index].strength = user.followers[follower_index].level_up_bonus.strength * follower.level;
				user.followers[follower_index].agility = user.followers[follower_index].level_up_bonus.agility * follower.level;
				user.followers[follower_index].intelligence = user.followers[follower_index].level_up_bonus.intelligence * follower.level;
				user.followers[follower_index].stamina = user.followers[follower_index].level_up_bonus.stamina * follower.level;
			});

			user.markModified('hero');
			user.markModified('followers');

			user.save(callback);
		})*/
	}
};