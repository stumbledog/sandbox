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
		var inventory = new InventoryModel();
		inventory.capacity = 100;
		inventory.slots = [];
		inventory.save(function(err, inventory){
			var user = new UserModel();
			user.gold = 100;
			user._inventory = inventory._id;
			user.save(function(err, user){
				UnitController.createHero(user._id, function(hero){
					this.loginById(user._id, req, res, callback);
				}.bind(this));
			}.bind(this));
		}.bind(this));
	},
	loginById:function(id, req, res, callback){
		UserModel.findById(id).populate('_inventory').exec(function(err, user){
			if(user){
				console.log("Found matching user in db");
				//user.last_logged_in = new Date();
				//user.save(function(err, user){
				req.session.user_id = user._id;
				res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
				HeroModel.findOne({_user:user._id}, function(err, hero){
					MapController.loadMap(hero.level, 1,1, function(map){
						callback(user, hero, [], map);
					});
				});
			}else{
				console.log("No matching data found in db");
				this.createUser(req, res, callback);
			}
		}.bind(this));
	}
};