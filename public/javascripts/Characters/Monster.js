function Monster(builder){
	this.initialize(builder);
}

Monster.prototype = new Unit();
Monster.prototype.constructor = Monster;
Monster.prototype.unit_initialize = Monster.prototype.initialize;

Monster.prototype.initialize = function(builder){
	this.unit_initialize(builder);

	this.health = builder.health;
	this.damage = builder.damage;
	this.attack_speed = builder.attack_speed;
	this.movement_speed = builder.movement_speed;
	this.range = builder.range;
	this.radius = builder.radius;
	console.log(builder);

	this.team = "Monster";
	this.health_color = "#C00";
	this.damage_color = "#CC0";
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
		}
	}.bind(this));

	this.addEventListener("rollout", function(event){
		if(this.status !== "death"){
			this.mouseover = false;
			this.outline.visible = false;
			this.outline.filters = null;
			this.outline.uncache();
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
		this.outline.filters = [new createjs.ColorFilter(0,0,0,1,185,18,27,0)];
		this.outline.cache(-12,-16,24,32);
	}
}