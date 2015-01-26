function Follower(file, index){
	this.follower_initialize(file, index);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;
Follower.prototype.container_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(file, index){
	this.container_initialize();
	this.game = Game.getInstance();

	this.type = "follower";
	this.team = "player";
	this.ticks = 0;

	this.max_health = this.health = 10;
	this.speed = 3;
	this.aggro_radius = 80;
	this.range = 24;
	this.attack_speed = 30;
	this.damage = 2;
	this.index = index;
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
	this.status = "attack";
	this.target = null;
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";

	this.initHealthBar();
}

Follower.prototype.tick = function(){
	this.target = this.findClosestEnemy();
	//this.target = this.findClosestEnemy(this.aggro_radius);
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.ticks > this.attack_speed){
			this.ticks = 0;
			this.attackTarget(this.target);
		}
	}else if(this.target){
		this.followPath(this.target, false);
	}else{
		this.stop();
		//this.followTarget(this.getStage().hero);
		/*
		var position = {x:this.getStage().hero.x + (this.index + 1) * 32,y:this.getStage().hero.y};
		this.followPath(position, false);*/
	}
	this.ticks++;
}