function Hero(sprite){
	this.initialize(sprite);
}

Hero.prototype = new createjs.Sprite();

Hero.prototype.Sprite_initialize = Hero.prototype.initialize;
Hero.prototype.stopPlaying = Hero.prototype.stop;

Hero.prototype.initialize = function(sprite){
	this.Sprite_initialize(sprite);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.speed = 3;
	this.status = "move";
	this.destination = null;
	this.move_queue = [];
}

Hero.prototype.move = function(x, y){
	this.move_queue = [{x:x,y:y}];
	//this.destination = {x:x,y:y};
	this.status = "move";
//	this.findPath();

	this.shiftMoveQueue();

}

Hero.prototype.findPath = function(){

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
}