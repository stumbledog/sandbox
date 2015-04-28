function Hero(builder){
	this.hero_initialize(builder);
}

Hero.prototype = Object.create(EquippedUnit.prototype);

Hero.prototype.constructor = Hero;
Hero.prototype.unit_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(builder){
	this.equipped_unit_initialize(builder);

	this.team = "Player";
	this.health_color = "#0C0";
	this.damage_color = "#FFE11A";

	this.initHealthBar();
	this.renderPortrait(builder.model.portrait, builder.model.index);
	this.order = {action:"stop", map:this.findPath({x:this.x,y:this.y})};
	this.renderRange();
	this.rotate(0,1);

	for(key in this.skills){
		this.skills[key].remain_cooldown = 0;
	}
}

Hero.prototype.getClassColor = function(){
	return "#fff";
}

Hero.prototype.renderRange = function(){
	this.range_shape = new createjs.Shape();
	this.range_shape.graphics.s("#F00").ss(2).dc(0, 0, this.radius + this.range);
	this.range_shape.alpha = 0.5;
}

Hero.prototype.move = function(x, y){
	Unit.prototype.move.call(this, x, y);
	var user = this.game.getUser();
	if(user.store){
		user.store.close();
		user.inventory.close();
	}

	if(user.action){
		user.action.close();
	}
}

Hero.prototype.renderHealthBar = function(){
	Unit.prototype.renderHealthBar.call(this);
	this.game.getUIStage().refreshHealthBar();
}

Hero.prototype.regenerate_resource = function(regen){
	Unit.prototype.regenerate_resource.call(this, regen);
	this.game.getUIStage().refreshResourceBar();
}

Hero.prototype.attackTarget = function(target, damage){
	Unit.prototype.attackTarget.call(this, target, damage);
	this.game.getUIStage().refreshHealthBar();
	this.game.getUIStage().refreshResourceBar();
}

Hero.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	this.game.getUIStage().refreshHealthBar();
	this.game.getUIStage().refreshResourceBar();
}

Hero.prototype.gainXP = function(exp){
	Unit.prototype.gainXP.call(this, exp);
	this.game.getUIStage().refreshExpBar();
}

Hero.prototype.showRange = function(){
	this.unit_stage.effect_container.addChild(this.range_shape);
}

Hero.prototype.hideRange = function(){
	this.unit_stage.effect_container.removeChild(this.range_shape);	
}

Hero.prototype.tick = function(){
	Unit.prototype.tick.call(this);
	this.range_shape.x = this.x;
	this.range_shape.y = this.y;
	this.game.viewport();
	for(key in this.active_skills){
		var skill = this.active_skills[key];
		if(skill.remain_cooldown > 0){
			skill.remain_cooldown -= 1/60;
			skill.remain_cooldown = skill.remain_cooldown < 0 ? 0 : skill.remain_cooldown;
			this.ui_stage.renderCooldown(key, skill.remain_cooldown, skill.cooldown);
		}
	}
	this.ui_stage.refreshSkillButton();
}

Hero.prototype.die = function(){
	Unit.prototype.die.call(this);
	this.game.getMessageStage().displayMessage("left_to_right", "Defeat", 60, "#B64926", 10, "#000", 1000, 0, -60);
	var user = this.game.getUser();
	user.saveStats();
	this.unit_stage.topMenu.open();
}