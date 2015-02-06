function Hero(builder){
	this.hero_initialize(builder);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.unit_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(builder){
	this.unit_initialize(builder);
	this.renderPortrait(builder.portrait_id, builder.index);
}

Hero.prototype.renderPortrait = function(portrait_id, index){
	this.portrait = new createjs.Bitmap(this.loader.getResult(portrait_id));
	this.portrait.sourceRect = new createjs.Rectangle(index % 4 *96,parseInt(index / 4) * 96,96,96);	
}

Hero.prototype.getPortrait = function(){
	return this.portrait;
}

Hero.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	this.game.getUIStage().refreshHealthBar();
}


Hero.prototype.gainExp = function(exp){
	Unit.prototype.gainExp.call(this, exp);
	this.game.getUIStage().refreshExpBar();
}