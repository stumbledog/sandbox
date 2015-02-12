function Hero(builder){
	this.hero_initialize(builder);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.unit_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(builder){
	this.unit_initialize(builder);
	this.renderPortrait(builder.portrait_id, builder.index);
	this.renderRange();
	this.order = {action:"stop", map:this.findPath({x:this.x,y:this.y})};
	this.rotate(0,1);

	for(key in this.skills){
		this.skills[key].remain_cooldown = 0;
	}
}

Hero.prototype.renderRange = function(){
	this.range_shape = new createjs.Shape();
	this.range_shape.graphics.s("#F00").ss(2).dc(0,0,this.range);
	this.range_shape.alpha = 0.5;
}

Hero.prototype.renderPortrait = function(portrait_id, index){
	this.portrait = new createjs.Bitmap(this.loader.getResult(portrait_id));
	this.portrait.sourceRect = new createjs.Rectangle(index % 4 * 96, parseInt(index / 4) * 96, 96, 96);
}

Hero.prototype.getPortrait = function(){
	return this.portrait;
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

Hero.prototype.gainExp = function(exp){
	Unit.prototype.gainExp.call(this, exp);
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
	for(key in this.skills){
		if(this.skills[key].remain_cooldown > 0){
			this.skills[key].remain_cooldown -= 1/30;
			this.skills[key].remain_cooldown = this.skills[key].remain_cooldown < 0 ? 0 : this.skills[key].remain_cooldown;
			this.ui_stage.renderCooldown(key, this.skills[key].remain_cooldown, this.skills[key].cooldown);
		}
	}
	this.ui_stage.refreshSkillButton();
}