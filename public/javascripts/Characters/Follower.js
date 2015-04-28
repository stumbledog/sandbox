function Follower(builder){
	this.follower_initialize(builder);
}

Follower.prototype = Object.create(EquippedUnit.prototype);

Follower.prototype.constructor = Follower;
Follower.prototype.unit_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(builder){
	this.equipped_unit_initialize(builder);	

	this.name = builder.model.name
	this.team = "Player";
	this.health_color = "#468966";
	this.damage_color = "#FFF0A5";

	this.initHealthBar();
	this.renderPortrait(builder.model.portrait, builder.model.index);
	if(this.x && this.y){
		this.order = {action:"stop", map:this.findPath({x:this.x,y:this.y})};
	}

}

Follower.prototype.getClassColor = function(){
	var color = {
		Fighter:"#F77A52",
		Thief:"#7E8AA2",
		Mage:"#91AA9D",
	};
	return color[this.name];
}

Follower.prototype.tick = function(){
	Unit.prototype.tick.call(this);
	for(key in this.active_skills){
		var skill = this.active_skills[key];
		if(skill.remain_cooldown > 0){
			skill.remain_cooldown -= 1/60;
			skill.remain_cooldown = skill.remain_cooldown < 0 ? 0 : skill.remain_cooldown;
		}
	}
}