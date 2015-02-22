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
		var gold = 100;
		user.save(function(err, user){
			if(err) return console.error(err);
			UnitController.createUnit(0, user._id, function(err, unit){
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
					if(err) return console.error(err);
					req.session.user_id = user._id;
					res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
					UnitController.getUnitsByUserId(user._id, function(err, units){
						MapModel.findOne({act:1,chapter:1}, function(err, map){
							callback(user, units, map);
						})
					});
				});
			}else{
				console.log("No matching data found in db");
				this.createUser(req, res, callback);
			}
		}.bind(this));
	}
};