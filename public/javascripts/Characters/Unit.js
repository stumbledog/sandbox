function Unit(file, index, stats){
	console.log("Unit instance");
	this.initialize(file, index, stats);
}

Unit.prototype = new createjs.Container();

Unit.prototype.container_initialize = Unit.prototype.initialize;

Unit.prototype.stopPlaying = Unit.prototype.stop;

Unit.prototype.initialize = function(file, index, stats){
	this.container_initialize();
	console.log("Unit initialize");
	this.game = Game.getInstance();
	this.interval = 60;
	this.ticks = 0;

	this.health = 10;
	this.speed = 1;
	this.range = 32;
	this.attack_speed = 120;
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
	this.weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	this.weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	this.weapon.x = 6;
	this.weapon.y = 8;
	this.weapon.regX = this.weapon.regY=16;
	this.weapon.rotation = this.direction;

	this.addChild(this.sprite, this.weapon);

	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "idle";
	this.destination = null;
	this.move_queue = [];
}

Unit.prototype.move = function(x, y){
	this.status = "move";
	this.target = null;
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	this.shiftMoveQueue();
}

Unit.prototype.shiftMoveQueue = function(){
	if(this.move_queue.length){
		this.destination = this.move_queue.shift();
		this.radian = Math.atan2(this.destination.x - this.x, this.destination.y - this.y);
		this.vx = Math.sin(this.radian) * this.speed;
		this.vy = Math.cos(this.radian) * this.speed;
		if(Math.abs(this.vx) > Math.abs(this.vy)){
			if(this.vx > 0){
				this.sprite.gotoAndPlay("right");
				this.direction = 90;
			}else{
				this.sprite.gotoAndPlay("left");
				this.direction = 270;
			}
		}else{
			if(this.vy > 0){
				this.sprite.gotoAndPlay("front");
				this.direction = 180;
			}else{
				this.sprite.gotoAndPlay("back");
				this.direction = 0;
			}
		}
	}else{
		this.stop();
	}
}

Unit.prototype.moveAttack = function(x, y){
	this.status = "move_attack";
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	this.shiftMoveQueue();
}

Unit.prototype.attackTarget = function(target){
/*	var weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	weapon.x = this.x + 6;
	weapon.y = this.y + 8;*/
	this.weapon.rotation = this.direction;
	var swing = this.weapon.rotation === 270 ? -90 : 90;
	var self = this;
	if(this.weapon.rotation === 270){
		this.weapon.rotation-=swing;
		createjs.Tween.get(self.weapon).to({rotation:self.weapon.rotation+swing},300, createjs.Ease.backOut).wait(100);		
	}else{
		createjs.Tween.get(self.weapon).to({rotation:self.weapon.rotation+swing},300, createjs.Ease.backOut).wait(100);
	}
}

Unit.prototype.stop = function(){
	this.move_queue = [];
	this.destination = null;
	this.stopPlaying();
	//this.status = "idle";
}


Unit.prototype.tick = function(){
	if(status === "move"){
		
	}else if(status === "attack"){
		
	}else if(status === "move_attack"){
		
	}else if(status === "idle"){
		
	}else if(status === "hold"){
		
	}

	if(this.status === "idle" && !this.target){
		var self = this;
		var enemy = this.game.getEnemies().reduce(function(prev, current){
			if(Math.pow(prev.x-self.x,2)+Math.pow(prev.y-self.y,2) > Math.pow(current.x-self.x,2)+Math.pow(current.y-self.y,2)){
				return current;
			}else{
				return prev;
			}
		});
		this.target = enemy;
		this.moveAttack(enemy.x,enemy.y);
	}

	if(this.target){
		if((Math.pow(this.x - this.target.x,2)+Math.pow(this.y - this.target.y,2)) <= Math.pow(this.range,2)){
			this.vx = this.vy = 0;
			if(this.attack_speed < this.ticks){
				this.attackTarget(this.target);
				this.ticks = 0;
			}
		}
	}

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

	if(!this.destination && !this.target){
		this.status = "idle"
	}
	this.ticks++;
}