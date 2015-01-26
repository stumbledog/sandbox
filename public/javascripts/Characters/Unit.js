function Unit(){}

Unit.prototype = new createjs.Container();

Unit.prototype.initHealthBar = function(){
	this.health_bar_border = new createjs.Shape();
	this.health_bar_border.graphics.s("#fff").ss(2).f("#fff").rr(-12,-16,24,4,1);
	this.health_bar = new createjs.Shape();
	this.health_bar.graphics.f(this.color).dr(-11,-15,22,2);
	this.addChild(this.health_bar_border, this.health_bar);
}

Unit.prototype.renderHealthBar = function(){
	this.health_bar.graphics.c().f(this.color).dr(-11,-15,22*(this.health/this.max_health),2);
}

Unit.prototype.setTarget = function(unit){
	this.target = unit;
	this.status = "attack";
}

Unit.prototype.move = function(x, y){
	this.destination = {x:x,y:y};
	this.status = "move";
	this.target = null;
	this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:x,y:y}, true);
}

Unit.prototype.rotate = function(dx, dy){
	var direction;
	if(Math.abs(dx) > Math.abs(dy)){
		if(dx > 0){
			direction = "right";
		}else{
			direction = "left";
		}
	}else{
		if(dy < 0){
			direction = "back";
		}else{
			direction = "front";
		}
	}

	if(direction !== this.direction){
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
}

Unit.prototype.moveAttack = function(x, y){
	this.destination = {x:x,y:y};
	this.status = "move_attack";
	this.target = this.findClosestEnemy(this.aggro_radius);
	this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:x,y:y}, false);
}

Unit.prototype.attackTarget = function(target, damage){
	if(target.status !== "death"){
		target.hit(this, this.damage);
		this.rotate(target.x - this.x, target.y - this.y);
		if(this.weapon){
			createjs.Tween.get(this.weapon).to({rotation:this.weapon.rotation + this.weapon.swing},100, createjs.Ease.backOut).to({rotation:this.weapon.rotation},100, createjs.Ease.backOut);
		}else{
			createjs.Tween.get(this.sprite).to({y:-8},300, createjs.Ease.backOut).to({y:0},300, createjs.Ease.backOut);
		}
	}
}

Unit.prototype.hit = function(attacker, damage){
	if(this.status !== "death"){
		this.health -= damage;
		if(this.health <= 0){
			this.health = 0;
			this.die(attacker);
		}else{
			createjs.Tween.get(this).call(function(event){
				event.target.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
				event.target.sprite.cache(-12,-16,24,32);
			}).wait(50).call(function(event){
				event.target.sprite.filters = null;
				event.target.sprite.uncache();
			});
		}
		this.renderHealthBar();
	}
}

Unit.prototype.die = function(attacker){
	createjs.Tween.get(this).call(function(event){
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.cache(-12,-16,24,32);
		event.target.status = "death";
		attacker.targetDied();
		var unit_coordinates = this.getStage().unit_coordinates;
		unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
	}).wait(300).call(function(event){
		event.target.sprite.uncache();
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,1)];
		event.target.sprite.cache(-12,-16,24,32);
	}).wait(300).call(function(event){
		event.target.sprite.uncache();
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.cache(-12,-16,24,32);
	}).wait(200).call(function(event){
		event.target.sprite.uncache();
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,1)];
		event.target.sprite.cache(-12,-16,24,32);
	}).wait(200).call(function(event){
		event.target.sprite.uncache();
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.cache(-12,-16,24,32);
	}).wait(100).call(function(event){
		event.target.sprite.uncache();
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,1)];
		event.target.sprite.cache(-12,-16,24,32);
	}).wait(100).call(function(event){
		event.target.getStage().removeUnit(event.target);
	});
}

Unit.prototype.targetDied = function(){
	this.target = null;
	if(this.status ==="move_attack"){
		this.move_queue = this.game.findPath(this, this, this.destination, false);
	}
}

Unit.prototype.setTarget = function(target){
	this.target = target;
	this.status = "attack";
	this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, target, true);
}

Unit.prototype.stop = function(){
	this.move_queue = [];
	this.destination = null;
	this.sprite.stop();
	this.status = "stop";
}

Unit.prototype.findClosestEnemy = function(range){
	var self = this;
	var enemies = this.parent.parent.getEnemies(this);
	var min;
	enemies.forEach(function(enemy){
		enemy.distance = this.getSquareDistance(enemy);
		if(range){
			if((!min || enemy.distance < min.distance) && enemy.distance < Math.pow(range,2)){
				min = enemy;
			}
		}else{
			if((!min || enemy.distance < min.distance)){
				min = enemy;
			}
		}
	},this);
	return min;
}

Unit.prototype.getSquareDistance = function(target){
	return Math.pow(this.x - target.x, 2)+Math.pow(this.y - target.y, 2);
}

Unit.prototype.followPath = function(destination, avoid_enemy, move_attack){
	if(this.move_queue.length && (Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed)){
		this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
		this.vx = Math.sin(this.radian) * this.speed;
		this.vy = Math.cos(this.radian) * this.speed;

		if(!this.unit_coordinates){
			this.unit_coordinates = this.parent.parent.unit_coordinates;
		}

		var indexX = parseInt((this.x + this.vx)/16);
		var indexY = parseInt((this.y + this.vy)/16);

		if(!(this.unit_coordinates[indexY] && this.unit_coordinates[indexY][indexX] && this.id !== this.unit_coordinates[indexY][indexX].id)){
			this.rotate(this.vx, this.vy);
			this.unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
			this.x += this.vx;
			this.y += this.vy;
			this.unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = this;
		}
	}else{
		if(move_attack){
			if(this.target){
				this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.target, false);
			}else if(this.move_queue.length){
				this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.move_queue[this.move_queue.length-1], false);					
			}else{
				this.stop();
			}
		}else if(destination){
			this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, destination, avoid_enemy);
		}else{
			this.stop();
		}
	}
}