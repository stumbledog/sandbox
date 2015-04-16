function PassiveSkill(skill){
	this.passive_skill_initialize(skill);
}

PassiveSkill.prototype = new Skill();
PassiveSkill.prototype.constructor = PassiveSkill;

PassiveSkill.prototype.passive_skill_initialize = function(skill){
	this.initialize(skill);
}