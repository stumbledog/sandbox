function Skill(){

}

Skill.prototype.initialize = function(skill, unit){
	this.game = Game.getInstance();
	this.loader = this.game.getLoader();
	this.user = this.game.getUser();
	this.ui_stage = this.game.getUIStage();

	this.name = skill.name;
	this.description = skill.description;
	this.unit = unit;
}