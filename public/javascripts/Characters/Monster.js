function Monster(file, index, x, y){
	this.initialize(file, index, x, y);
}

Monster.prototype = new Unit();

Monster.prototype.constructor = Monster;
Monster.prototype.container_initialize = Monster.prototype.initialize;

Monster.prototype.initialize = function(file, index, x, y){
	this.container_initialize();
	this.game = Game.getInstance();
	this.type = "monster";
	this.team = "enemy";
	this.ticks = 0;
	this.aggro_radius = 80;
	this.exp = 50;
	this.max_health = this.health = 10;
	this.speed = 1;
	this.range = 32;
	this.attack_speed = 60;
	this.damage = 1;
	this.direction = 180;
	this.radius = 16;
	this.mass = 1;
	this.x = x;
	this.y = y;
	this.velocity = new Vector(0,0);
	this.order = {action:"annihilate",map:this.game.findPath({x:this.x,y:this.y}),destination:new Vector(x,y)};

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
	this.isAttack = false;
	this.color = "#C00";
	this.damage_color = "#CC0";
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

Monster.prototype.tick = function(){
	Unit.prototype.tick.call(this);
	if(this.mouseover){
		this.sprite.uncache();
		this.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
		this.sprite.cache(-12,-16,24,32);
	}
}