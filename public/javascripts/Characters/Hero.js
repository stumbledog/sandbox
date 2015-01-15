function Hero(sprite){
	this.initialize(sprite);
}

Hero.prototype = new createjs.Sprite();

Hero.prototype.Sprite_initialize = Hero.prototype.initialize;

Hero.prototype.initialize = function(sprite){
	this.Sprite_initialize(sprite);
	this.speed = 3;
}

Hero.prototype.move = function(x, y){
	this.target = {x:x,y:y};

	this.radian = Math.atan2(this.target.x - this.x, this.target.y - this.y);
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
}

Hero.prototype.tick = function(){
	if(this.target){
		if(Math.abs(this.target.x - this.x) > this.speed || Math.abs(this.target.y - this.y) > this.speed){
			this.x += this.vx;
			this.y += this.vy;
		}else{
			this.target = null;
			this.stop();
		}
	}
}