function ActiveSkill(skill){
	this.active_skill_initialize(skill);
}

ActiveSkill.prototype = new Skill();
ActiveSkill.prototype.constructor = ActiveSkill;

ActiveSkill.prototype.active_skill_initialize = function(skill){
	this.skill_initialize(skill);
	this.cost = skill.cost;
	this.cooldown = skill.cooldown;
	this.range = skill.range;
}

ActiveSkill.prototype.use = function(target){
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

ActiveSkill.prototype.fireball = function(target){

}