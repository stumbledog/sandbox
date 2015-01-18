function Hero(file, index){
	console.log("Hero instance");
	this.initialize(file, index);
	this.hero_initialize();
}

Hero.prototype = Unit.prototype;

Hero.prototype.hero_initialize = function(){
	console.log("Hero initialize");
	this.status = "move";
}

/*
function Hero(file, index){
	this.initialize(file, index);
}

Hero.prototype = new createjs.Sprite();

Hero.prototype.sprite_initialize = Hero.prototype.initialize;
Hero.prototype.stopPlaying = Hero.prototype.stop;

Hero.prototype.initialize = function(file, index){
	this.game = Game.getInstance();

	var frames = [];
	var offsetX = index % 2 *32;
	var offsetY = parseInt(index / 2) *32;

	for(var i=0 ;i < 12; i++){
		frames.push([offsetX+(i%3)*24,offsetY+parseInt(i/3)*32+1,24,32,0,12,16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(file)],
		frames:frames,
		animations:{
			front:{
				frames:[0,1,2],
				speed:0.3
			},
			left:{
				frames:[3,4,5],
				speed:0.3
			},
			right:{
				frames:[6,7,8],
				speed:0.3
			},
			back:{
				frames:[9,10,11],
				speed:0.3
			},
		}
	});

	this.sprite_initialize(spriteSheet);

	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.speed = 10;
	this.status = "move";
	this.destination = null;
	this.move_queue = [];
}

Hero.prototype.move = function(x, y){
	this.status = "move";
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	this.shiftMoveQueue();
}


Hero.prototype.shiftMoveQueue = function(){
	if(this.move_queue.length){
		this.destination = this.move_queue.shift();
		this.radian = Math.atan2(this.destination.x - this.x, this.destination.y - this.y);
		this.vx = Math.sin(this.radian) * this.speed;
		this.vy = Math.cos(this.radian) * this.speed;
		if(Math.abs(this.vx) > Math.abs(this.vy)){
			if(this.vx > 0){
				this.gotoAndPlay("right");
			}else{
				this.gotoAndPlay("left");
			}
		}else{
			if(this.vy > 0){
				this.gotoAndPlay("front");
			}else{
				this.gotoAndPlay("back");
			}
		}
	}else{
		this.stop();
	}
}

Hero.prototype.attackPoint = function(x, y){
	this.status = "attack";

}

Hero.prototype.attackTarget = function(target){

}

Hero.prototype.stop = function(){
	this.move_queue = [];
	this.stopPlaying();
}


Hero.prototype.tick = function(){
	if(this.destination){
		if(Math.abs(this.destination.x - this.x) > this.speed || Math.abs(this.destination.y - this.y) > this.speed){
			this.x += this.vx;
			this.y += this.vy;
		}else{
			this.shiftMoveQueue();
		}
	}else{
		if(this.move_queue.length){
			this.shiftMoveQueue();
		}
	}
}*/