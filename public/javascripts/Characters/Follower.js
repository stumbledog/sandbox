function Follower(builder){
	this.follower_initialize(builder);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;
Follower.prototype.unit_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(builder){
	this.unit_initialize(builder);
}

