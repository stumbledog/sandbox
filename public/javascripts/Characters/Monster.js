function Monster(builder){
	this.initialize(builder);
}

Monster.prototype = new Unit();
Monster.prototype.constructor = Monster;
Monster.prototype.unit_initialize = Monster.prototype.initialize;

Monster.prototype.initialize = function(builder){
	this.unit_initialize(builder);
	this.initHealthBar();
	this.initEventListener();
	this.rotate(0,1);
	this.order = {action:"guard", map:this.findPath({x:this.x,y:this.y})};
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
			this.outline.visible = true;
			//this.getStage().setTarget(this);
		}
	}.bind(this));

	this.addEventListener("rollout", function(event){
		if(this.status !== "death"){
			this.mouseover = false;
			this.outline.visible = false;
			this.outline.filters = null;
			this.outline.uncache();
			//this.getStage().unsetTarget(this);
		}
	}.bind(this));
}

Monster.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	if(!this.target){
		this.target = attacker;
	}
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
		this.outline.uncache();
		this.outline.filters = [new createjs.ColorFilter(0,0,0,1,255,0,0,0)];
		this.outline.cache(-12,-16,24,32);
	}
}