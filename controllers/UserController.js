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
				user.save(function(err, user){
					req.session.user_id = user._id;
					res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
					MapController.loadBasecamp(user.hero.level, function(map){
						callback(user, map);
					});
				});
			}else{
				console.log("No matching data found in db");
				this.createUser(req, res, callback);
			}
		}.bind(this));
	},
	loadStage:function(user_id, act, chapter, difficulty_level, res, callback){
		UserModel.findById(user_id, function(err, user){
			if(err || !user){
				res.redirect('/');
			}else{
				MapController.loadMap(user.hero.level, act, chapter, difficulty_level, function(err, map){
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
	}
};