function Hero(file, index){
	this.hero_initialize(file, index);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.container_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(file, index){
	this.container_initialize();
	this.game = Game.getInstance();

	this.type = "hero";
	this.team = "player";
	this.ticks = 0;

	this.max_health = this.health = 50;
	this.speed = 3;
	this.aggro_radius = 80;
	this.range = 24;
	this.attack_speed = 20;
	this.damage = 5;

	this.frames = [];
	var offsetX = index % 4 *72;
	var offsetY = parseInt(index / 4) * 128;

	for(var i=0 ;i < 12; i++){
		this.frames.push([offsetX+(i%3)*24,offsetY+parseInt(i/3)*32+1,24,32,0,12,16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(file)],
		frames:this.frames,
		animations:{
			front:{
				frames:[0,1,2],
				speed:this.speed/10,
			},
			left:{
				frames:[3,4,5],
				speed:this.speed/10,
			},
			right:{
				frames:[6,7,8],
				speed:this.speed/10,
			},
			back:{
				frames:[9,10,11],
				speed:this.speed/10,
			},
		}
	});
	this.sprite = new createjs.Sprite(spriteSheet);
	this.sprite.z = 0;

	this.weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	this.weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	this.weapon.z = 1;
	this.weapon.regX = this.weapon.regY=12;
	this.weapon.scaleX = this.weapon.scaleY = 0.8;

	this.addChild(this.sprite, this.weapon);

	this.rotate(0,0);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "stop";
	this.target = null;
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";

	this.initHealthBar();
}

Hero.prototype.tick = function(){
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.target.status === "death"){
			this.target = null;
		}else{
			if(this.ticks > this.attack_speed){
				this.ticks = 0;
				this.attackTarget(this.target);
			}			
		}
	}else if(this.status === "move"){
		this.followPath(this.move_queue[this.move_queue.length-1], true);
	}else if(this.status === "move_attack"){
		this.target = this.findClosestEnemy(this.aggro_radius);
		this.followPath(null, null, true);
	}else if(this.status === "attack"){
		if(this.target){
			this.followPath(this.target, true);
		}else{
			this.stop();
		}
	}
	this.ticks++;
}