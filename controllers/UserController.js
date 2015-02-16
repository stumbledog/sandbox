exports.authenticate = function(req, res, callback){
	if(req.session.user){
		UserModel.findById(req.session.user, function(err, user){
			callback(user);
		});
	}else{
		if(req.cookies.user_id){
			var self = this;
			UserModel.findById(req.cookies.user_id, function(err, user){
				if(user){
					req.session.user = user._id;
					callback(user);
				}else{
					self.createUser(req, res, callback);
				}
			});
		}else{
			this.createUser(req, res, callback);
		}
	}
}

exports.createUser = function(req, res, callback){
	var user = new UserModel();
	var gold = 100;
	user.save(function(){
		req.session.user = user._id;
		res.cookie('user_id', user._id, {maxAge: 10 * 365 * 24 * 60 * 60 * 1000, httpOnly: true });
		callback();
	});
}