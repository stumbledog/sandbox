function Follower(builder){
	this.follower_initialize(builder);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;
Follower.prototype.unit_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(builder){
	this.unit_initialize(builder);
	
	this.team = "Player";
	this.movement_speed = 1;
	this.max_resource = 100;
	this.radius = 12;//builder.radius;
	this.aggro_radius = 80;//builder.aggro_radius;
	this.range = 16;//builder.range;
	this.attack_speed = 60;//builder.attack_speed;
	this.damage = 1;//builder.damage;

	this.health_color = "#046380";
	this.damage_color = "#C00";
	this.initHealthBar();
	this.order = {action:"stop", map:this.findPath({x:this.x,y:this.y})};
}