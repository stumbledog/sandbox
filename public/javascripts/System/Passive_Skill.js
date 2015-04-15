function Passive_Skill(skill, unit){
	this.passive_skill_initialize(skill, unit);
}

Passive_Skill.prototype = new SKill();
Passive_Skill.prototype.constructor = Passive_Skill;

Passive_Skill.prototype.passive_skill_initialize = function(skill, unit){
	this.skill_initialize(skill, unit);
}