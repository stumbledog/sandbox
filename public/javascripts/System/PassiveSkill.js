function PassiveSkill(skill, unit){
	this.passive_skill_initialize(skill, unit);
}

PassiveSkill.prototype = new Skill();
PassiveSkill.prototype.constructor = PassiveSkill;

PassiveSkill.prototype.passive_skill_initialize = function(skill, unit){
	this.initialize(skill, unit);
	this.unit[skill.key] = true;
	console.log(skill.key);
	console.log(this.unit);
	//this.ability();
}

PassiveSkill.prototype.ability = function(){
	/*
	switch(this.name){
		case "Defend":
			this.unit.defend = true;
			break;
		case "Dual Wield":
			this.unit.dual_wield = true;
			break;
		case "Wand Specialization":
			this.unit.wand = true;
			break;
		case "Endurance":
			this.unit.endurance = true;
			break;
	}*/
}