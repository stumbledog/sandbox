function User(builder){
	this.id = builder._id;
	this.created_at = builder.created_at;
	this.last_logged_in = builder.last_logged_in;
}

User.prototype.save = function(){

}