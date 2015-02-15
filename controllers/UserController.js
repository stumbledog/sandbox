exports.authenticate = function(req, res, callback){
	callback();
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