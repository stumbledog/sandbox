function PassiveSkill(skill, unit){
	this.passive_skill_initialize(skill, unit);
}

PassiveSkill.prototype = new Skill();
PassiveSkill.prototype.constructor = PassiveSkill;

PassiveSkill.prototype.passive_skill_initialize = function(skill, unit){
	this.initialize(skill, unit);
	this.unit[skill.key] = true;
}