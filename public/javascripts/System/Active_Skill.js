function Active_Skill(skill, unit){
	this.active_skill_initialize(skill, unit);
}

Active_Skill.prototype = new SKill();
Active_Skill.prototype.constructor = Active_Skill;

Active_Skill.prototype.active_skill_initialize = function(skill, unit){
	this.skill_initialize(skill, unit);
	this.cost = skill, unit.cost;
	this.cooldown = skill, unit.cooldown;
}

Active_Skill.prototype.use = function(target){
	if(unit.resource >= this.cost){
		unit.resource -= this.cost;
		switch(this.name){
			case "Fireball":
				this.fireball(target);
				break;
		}
	}else{
		alert("Not enough resource");
	}
}

Active_Skill.prototype.fireball = function(target){

}