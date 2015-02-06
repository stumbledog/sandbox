function Monster(builder){
	this.initialize(builder);
}

Monster.prototype = new Unit();

Monster.prototype.constructor = Monster;
Monster.prototype.unit_initialize = Monster.prototype.initialize;

Monster.prototype.initialize = function(builder){
	this.unit_initialize(builder);
	this.initEventListener();
}

Monster.prototype.initEventListener = function(){
	this.addEventListener("mousedown", function(event){
		if(event.nativeEvent.button == 2){
			this.getStage().setTarget(this);
		}else{

		}
	}.bind(this));

	this.addEventListener("rollover", function(event){
		if(this.status !== "death"){
			this.mouseover = true;
			this.getStage().setTarget(this);
		}
	}.bind(this));

	this.addEventListener("rollout", function(event){
		if(this.status !== "death"){
			this.mouseover = false;
			this.sprite.filters = null;
			this.sprite.uncache();
			this.getStage().unsetTarget(this);
		}
	}.bind(this));
}


Monster.prototype.die = function(attacker){
	var allied_units = this.game.getUnitStage().getAlliedUnits(attacker);
	allied_units.forEach(function(unit){
		unit.gainExp(this.exp/allied_units.length);
	},this);

	Unit.prototype.die.call(this, attacker);
}

Monster.prototype.tick = function(){
	Unit.prototype.tick.call(this);
	if(this.mouseover){
		this.sprite.uncache();
		this.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
		this.sprite.cache(-12,-16,24,32);
	}
}