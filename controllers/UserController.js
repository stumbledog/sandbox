exports.authenticate = function(req, res, callback){
	callback();
}

exports.createUser = function(req, res, callback){
	var user = new UserModel();
	var gold = 100;
	user.save(function(){

	});
}