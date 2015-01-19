function Unit(){

}

Unit.prototype = new createjs.Container();

Unit.prototype.initHealthBar = function(){
	this.health_bar_border = new createjs.Shape();
	this.health_bar_border.graphics.s("#fff").ss(2).rr(-12,-16,24,4,1);
	this.health_bar = new createjs.Shape();
	this.health_bar.graphics.f(this.color).dr(-11,-15,22,2);
	this.addChild(this.health_bar_border, this.health_bar);
}

Unit.prototype.renderHealthBar = function(){
	this.health_bar.graphics.f(this.color).dr(-11,-15,22*(this.health/this.max_health),2);
}

Unit.prototype.move = function(x, y){
	this.status = "move";
	this.target = null;
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	//this.shiftMoveQueue();
	console.log("move");
}

Unit.prototype.shiftMoveQueue = function(){
	if(this.move_queue.length){
		//this.destination = this.move_queue.shift();
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
	this.direction = direction;
	if(this.direction === "back"){
		if(this.weapon){
			this.sortChildren(function(obj1, obj2){return obj1.z<obj2.z?1:-1;});
			this.weapon.rotation = 90;
			this.swing = -90;
			this.weapon.x = 6;
			this.weapon.y = 6;
		}
	}else if(this.direction === "right"){
		if(this.weapon){
			this.sortChildren(function(obj1, obj2){return obj1.z>obj2.z?1:-1;});
			this.weapon.rotation = 90;
			this.weapon.swing = 90;
			this.weapon.x = 0;
			this.weapon.y = 10;
		}
	}else if(this.direction === "front"){
		if(this.weapon){
			this.sortChildren(function(obj1, obj2){return obj1.z>obj2.z?1:-1;});			
			this.weapon.rotation = -90;
			this.weapon.swing = -90;
			this.weapon.x = -6;
			this.weapon.y = 10;
		}
	}else if(this.direction === "left"){
		if(this.weapon){
			this.sortChildren(function(obj1, obj2){return obj1.z<obj2.z?1:-1;});			
			this.weapon.rotation = 0;
			this.weapon.swing = -90;
			this.weapon.x = 0;
			this.weapon.y = 10;
		}
	}
	this.sprite.gotoAndPlay(this.direction);
}

Unit.prototype.attackMove = function(x, y){
	this.status = "attack_move";
	this.move_queue = this.game.findPath({x:this.x,y:this.y}, {x:x,y:y});
	this.shiftMoveQueue();
}

Unit.prototype.attackTarget = function(target){
	createjs.Tween.get(this.weapon).to({rotation:this.weapon.rotation + this.weapon.swing},100, createjs.Ease.backOut).to({rotation:this.weapon.rotation},100, createjs.Ease.backOut);
}

Unit.prototype.stop = function(){
	console.log("stop!!");
	this.move_queue = [];
	this.destination = null;
	this.sprite.stop();
	this.status = "stop";
}

/*
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
		//console.log(enemies);
		//console.log(this.game.getUnits().constructor);
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
			
			var units = this.game.getUnits();
			units.forEach(function(unit){
				if(unit.id !== this.id && parseInt(unit.x/16) === parseInt((this.x + this.vx)/16) && parseInt(unit.y/16)===parseInt((this.y + this.vy)/16)){
					console.log("collision");
					this.vx = this.vy = 0;
					this.move_queue = this.game.findAlterPath({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
					this.shiftMoveQueue();
				}
			},this);

			this.x += this.vx;
			this.y += this.vy;
		}else{
			this.shiftMoveQueue();
		}
	}else{
		console.log(this.move_queue);
		if(this.move_queue.length){
			this.shiftMoveQueue();
		}
	}

	if(!this.destination && !this.target){
		this.status = "idle"
	}
	this.ticks++;
}*/