function Monster(file, index){
	this.initialize(file, index);
}

Monster.prototype = new Unit();

Monster.prototype.constructor = Monster;
//Monster.constructor = Unit.prototype.constructor;
Monster.prototype.container_initialize = Monster.prototype.initialize;

Monster.prototype.initialize = function(file, index){
	this.container_initialize();

	this.game = Game.getInstance();
	
	this.type = "monster";
	this.team = "enemy";
	this.ticks = 0;
	this.aggro_radius = 80;
	this.exp = 20;

	this.max_health = this.health = 10;
	this.speed = .2;
	this.range = 24;
	this.attack_speed = 30;
	this.damage = 1;
	this.direction = 180;


	var frames = [];
	var offsetX = index % 4 *72;
	var offsetY = parseInt(index / 4) * 128;

	for(var i=0 ;i < 12; i++){
		frames.push([offsetX+(i%3)*24,offsetY+parseInt(i/3)*32+1,24,32,0,12,16]);
	}
	
	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(file)],
		frames:frames,
		animations:{
			front:{
				frames:[0,1,2],
				speed:0.1
			},
			left:{
				frames:[3,4,5],
				speed:0.1
			},
			right:{
				frames:[6,7,8],
				speed:0.1
			},
			back:{
				frames:[9,10,11],
				speed:0.1
			},
		}
	});

	this.sprite = new createjs.Sprite(spriteSheet);
	this.sprite.z = 0;
	this.addChild(this.sprite);

	this.rotate(0,0);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "idle";
	this.destination = null;
	this.move_queue = [];
	this.color = "#C00";
	this.vx = this.vy = 0

	this.initEventListener();
	this.initHealthBar();
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
			this.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
			this.sprite.cache(-12,-16,24,32);
			this.getStage().setTarget(this);
		}
	}.bind(this));

	this.addEventListener("rollout", function(event){
		if(this.status !== "death"){
			this.sprite.filters = null;
			this.sprite.uncache();
			this.getStage().unsetTarget(this);
		}
	}.bind(this));
}

Monster.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	if(this.status !== "attack"){
		this.status = "attack";
	}
}

Monster.prototype.tick = function(){
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.ticks > this.attack_speed){
			this.ticks = 0;
			this.attackTarget(this.target);
		}
	}else if(this.status === "idle"){
		this.target = this.findClosestEnemy(this.aggro_radius);
		if(this.target){
			this.status = "attack";
		}else{
			this.move_queue = this.getStage().findNeighbor(this, this.x, this.y);
			if(this.move_queue.length){
				this.status = "roaming";
			}
		}
	}else if(this.status === "roaming"){
		if(this.move_queue.length){
			this.followPath(this.move_queue[0], true);
		}else{
			this.status = "idle";
		}
	}else if(this.status === "attack"){
		if(this.target && this.getSquareDistance(this.target) < Math.pow(this.aggro_radius,2)){
			this.followPath(this.target, true);
		}else{
			this.target = null;
			this.status = "idle";
		}
	}
	this.ticks++;
}