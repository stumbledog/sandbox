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
	this.destination = {x:x,y:y};
	this.status = "move";
	this.target = null;
	this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:x,y:y}, true);
	console.log("move");
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
	this.target = this.findClosestEnemy(this.range);
	this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:x,y:y}, false);
}

Unit.prototype.attackTarget = function(target, damage){
	target.hit(this, 10);
	console.log(target.x - this.x, target.y - this.y);
	this.rotate(target.x - this.x, target.y - this.y);
	createjs.Tween.get(this.weapon).to({rotation:this.weapon.rotation + this.weapon.swing},100, createjs.Ease.backOut).to({rotation:this.weapon.rotation},100, createjs.Ease.backOut);
}

Unit.prototype.hit = function(attacker, damage){
	this.health -= damage;
	if(this.health <= 0){
		this.health = 0;
		this.die(attacker);
	}else{
		createjs.Tween.get(this).call(function(event){
			event.target.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
			event.target.sprite.cache(-12,-16,24,32);
		}).wait(300).call(function(event){
			event.target.sprite.filters = null;
			event.target.sprite.uncache();
		});
	}
}

Unit.prototype.die = function(attacker){
	console.log("die");
	createjs.Tween.get(this).call(function(event){
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.cache(-12,-16,24,32);
		event.target.status = "death";
		attacker.target = null;
		attacker.move_queue = this.game.findPath(attacker, attacker, attacker.destination, false);
		console.log(attacker, attacker.destination);
		console.log(attacker.move_queue);
		var unit_coordinates = this.game.getUnitCoordinates();
		unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
	}).wait(300).call(function(event){
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,1)];
		event.target.sprite.updateCache();
	}).wait(300).call(function(event){
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.updateCache();
		event.target.game.removeUnit(event.target);
	});
}

Unit.prototype.stop = function(){
	console.log("stop!!");
	this.move_queue = [];
	this.destination = null;
	this.sprite.stop();
	this.status = "stop";
}

Unit.prototype.findClosestEnemy = function(range){
	var self = this;
	var enemies = this.game.getEnemies(this);
	var min;
	enemies.forEach(function(enemy){
		enemy.distance = this.getSquareDistance(enemy);
		if((!min || enemy.distance < min.distance) && enemy.distance < Math.pow(range,2)){
			min = enemy;
		}
	},this);
	return min;
}

Unit.prototype.getSquareDistance = function(target){
	return Math.pow(this.x - target.x, 2)+Math.pow(this.y - target.y, 2);
}