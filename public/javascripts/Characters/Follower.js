function Follower(builder){
	this.follower_initialize(builder);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;
Follower.prototype.unit_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(builder){
	this.unit_initialize(builder);
	
	this.character_class = builder.character_class;
	this.primary_attribute = parseInt(builder.primary_attribute);
	this.strength = parseInt(builder.strength);
	this.agility = parseInt(builder.agility);
	this.intelligence = parseInt(builder.intelligence);
	this.stamina = parseInt(builder.stamina);
	this.movement_speed = 1.5;
	this.max_health = this.health = 100;
	this.level = builder.level;
	this.exp = builder.exp;
	this.resource_type = builder.resource_type;

	if(this.resource_type === "fury"){
		this.resource = 0;
	}else{
		this.resource = 100;
	}
	
	this.max_resource = 100;
	this.radius = 12;
	this.aggro_radius = 80;
	this.range = 16;
	this.attack_speed = 60;

	this.updateStats();

	this.team = "Player";
	this.health_color = "#468966";
	this.damage_color = "#C00";

	this.initHealthBar();
	this.renderPortrait(builder.portrait.split('/').pop(), builder.index);
	this.order = {action:"stop", map:this.findPath({x:this.x,y:this.y})};
}

Follower.prototype.getClassColor = function(){
	var color = {
		Fighter:"#F77A52",
		Thief:"#D8CAA8",
		Mage:"#91AA9D",
	};
	console.log(this.character_class);
	console.log(color[this.character_class]);
	return color[this.character_class];
}