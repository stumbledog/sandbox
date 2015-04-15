function SKill(){

}

Skill.prototype.initialize = function(skill, unit){
	this.name = skill.name;
	this.description = skill.description;
	this.unit = unit;
}