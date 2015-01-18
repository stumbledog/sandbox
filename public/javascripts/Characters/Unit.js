function Unit(file, index, stats){
	console.log("Unit instance");
	this.initialize(file, index, stats);
}

Unit.prototype = new createjs.Container();

Unit.prototype.container_initialize = Unit.prototype.initialize;

Unit.prototype.initialize = function(file, index, stats){
	this.container_initialize();
	console.log("Unit initialize");
	this.game = Game.getInstance();
	this.interval = 60;
	this.ticks = 0;

	this.health = 10;
	this.speed = 1;
	this.range = 32;
	this.attack_speed = 30;
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

	this.weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	this.weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	this.weapon.z = 1;
	this.weapon.regX = this.weapon.regY=12;
	this.weapon.rotation = this.direction;
	this.weapon.scaleX = this.weapon.scaleY = 0.8;

	this.addChild(this.sprite, this.weapon);

	this.rotate("front");
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "idle";
	this.destination = null;
	this.move_queue = [];
}

Unit.prototype.move = function(x, y){
	this.status = "move";
	this.target = null;
	//console.log(this.game.findPath({x:this.x,y:this.y}, {x:x,y:y}));
	
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
				this.rotate("right");
			}else{
				this.rotate("left");
			}
		}else{
			if(this.vy > 0){
				this.rotate("front");
			}else{
				this.rotate("back");
			}
		}
	}else{
		this.stop();
	}
}

Unit.prototype.rotate = function(direction){
	this.sprite.gotoAndPlay(direction);
	if(direction === "back"){
		this.direction = 0;
		this.weapon.rotation = 90;
		this.swing = 90;
		this.weapon.x = 10;
		this.weapon.y = 0;
		this.sortChildren(function(obj1, obj2){return obj1>obj2?1:-1;});
	}else if(direction === "right"){
		this.weapon.rotation = this.direction = 90;
		this.weapon.swing = 90;
		this.weapon.x = 0;
		this.weapon.y = 10;
		this.sortChildren(function(obj1, obj2){return obj1<obj2?1:-1;});
	}else if(direction === "front"){
		this.direction = 180;
		this.weapon.rotation = 270;
		this.weapon.swing = -90;
		this.weapon.x = -6;
		this.weapon.y = 10;
		this.sortChildren(function(obj1, obj2){return obj1<obj2?1:-1;});
	}else if(direction === "left"){
		this.direction = 270;
		this.weapon.rotation = 0;
		this.weapon.swing = -90;
		this.weapon.x = 0;
		this.weapon.y = 10;
		this.sortChildren(function(obj1, obj2){return obj1>obj2?1:-1;});
	}
}

Unit.prototype.moveAttack = function(x, y){
	this.status = "move_attack";
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	this.shiftMoveQueue();
}

Unit.prototype.attackTarget = function(target){
	var self = this;
	createjs.Tween.get(self.weapon).to({rotation:self.weapon.rotation+this.weapon.swing},100, createjs.Ease.backOut).to({rotation:self.weapon.rotation},100, createjs.Ease.backOut);
}

Unit.prototype.stop = function(){
	this.move_queue = [];
	this.destination = null;
	this.sprite.stop();
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
		var enemies = this.game.getEnemies();
		if(enemies.length){
			var enemy = enemies.reduce(function(prev, current){
				if(Math.pow(prev.x-self.x,2)+Math.pow(prev.y-self.y,2) > Math.pow(current.x-self.x,2)+Math.pow(current.y-self.y,2)){
					return current;
				}else{
					return prev;
				}
			});
			this.target = enemy;
			this.moveAttack(enemy.x,enemy.y);			
		}
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