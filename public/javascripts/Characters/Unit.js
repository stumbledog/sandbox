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

Unit.prototype.move = function(x, y){
	this.order.action = "move";
	this.order.target = null;
	this.order.map = this.game.findPath({x:x,y:y});
}

Unit.prototype.stop = function(){
	this.order.action = "stop";
	this.order.target = null;
	this.order.map = this.game.findPath({x:this.x,y:this.y});
}

Unit.prototype.moveAttack = function(x, y){
	this.order.action = "move_attack";
	this.order.target = null;
	this.order.map = this.game.findPath({x:x,y:y});
}

Unit.prototype.attack = function(target){
	this.order.action = "attack";
	this.order.target = target;
	this.order.map = this.game.findPath({x:target.x,y:target.y});
}

Unit.prototype.follow = function(target, units, map){
	var vx = target.x - this.x;
	var vy = target.y - this.y;
	units.forEach(function(unit){
		var distance = Math.sqrt(Math.pow(unit.x-this.x,2)+Math.pow(unit.y-this.y,2));
		if(distance !== 0){
			if(this.team === unit.team){
				var power = distance < this.radius + unit.radius ? 100 : 10;
			}else{
				var power = distance < this.radius + unit.radius ? 1000 : 1;
			}
			var magnitude = unit.mass / this.mass * power / (Math.pow(this.x-unit.x,2) + Math.pow(this.y-unit.y,2));
			var direction = {
				x:(unit.x - this.x) / distance * magnitude,
				y:(unit.y - this.y) / distance * magnitude
			};
			vx -= direction.x;
			vy -= direction.y;
		}
	},this);

	var vector_length = Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
	vx /= vector_length / this.speed;
	vy /= vector_length / this.speed;

	var indexX = Math.floor(this.x / 16);
	var indexY = Math.floor(this.y / 16);
	var indexVX = Math.floor((this.x +vx)/ 16);
	var indexVY = Math.floor((this.y +vy)/ 16);

	if(!map[indexVY] || !map[indexVY][indexVX] || map[indexVY][indexVX].block){
		if(map[indexY][indexVX] && !map[indexY][indexVX].block){
			vy = 0;
		}else if(map[indexVY] && !map[indexVY][indexX].block){
			vx = 0;
		}else{
			vx = vy = 0;
		}
	}
	this.x += vx;
	this.y += vy;
	this.rotate(vx,vy);
}

Unit.prototype.procMove = function(x, y, units, map){
	var vx = vy = 0;	
	units.forEach(function(unit){
		var distance = Math.sqrt(Math.pow(unit.x-this.x,2)+Math.pow(unit.y-this.y,2));
		if(distance !== 0){
			if(this.team === unit.team){
				var power = distance < this.radius + unit.radius ? 100 : 10;
			}else{
				var power = distance < this.radius + unit.radius ? 1000 : 1;
			}
			var magnitude = unit.mass / this.mass * power / (Math.pow(this.x-unit.x,2) + Math.pow(this.y-unit.y,2));
			var direction = {
				x:(unit.x - this.x) / distance * magnitude,
				y:(unit.y - this.y) / distance * magnitude
			};
			vx -= direction.x;
			vy -= direction.y;
		}
	},this);

	var indexX = Math.floor(this.x / 16);
	var indexY = Math.floor(this.y / 16);

	vx += map[indexY][indexX].vx;
	vy += map[indexY][indexX].vy;
	if(Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5){
		vx = vy = 0;
	}else{
		var vector_length = Math.sqrt(Math.pow(vx,2)+Math.pow(vy,2));
		vx /= vector_length / this.speed;
		vy /= vector_length / this.speed;
	}

	var indexVX = Math.floor((this.x +vx)/ 16);
	var indexVY = Math.floor((this.y +vy)/ 16);

	if(!map[indexVY] || !map[indexVY][indexVX] || map[indexVY][indexVX].block){
		if(map[indexY][indexVX] && !map[indexY][indexVX].block){
			vy = 0;
		}else if(map[indexVY] && !map[indexVY][indexX].block){
			vx = 0;
		}else{
			vx = vy = 0;
		}
	}

	this.x += vx;
	this.y += vy;
	this.rotate(vx, vy);
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

Unit.prototype.attackTarget = function(target, damage){
	if(target.status !== "death" || this.status !== "death"){
		target.hit(this, this.damage);
		this.rotate(target.x - this.x, target.y - this.y);
		if(this.weapon){
			createjs.Tween.get(this.weapon).to({rotation:this.weapon.rotation + this.weapon.swing},this.attack_speed*10, createjs.Ease.backOut).to({rotation:this.weapon.rotation},this.attack_speed*10, createjs.Ease.backOut);
		}else{
			createjs.Tween.get(this.sprite).to({y:-8},this.attack_speed*10, createjs.Ease.backOut).to({y:0},this.attack_speed*10, createjs.Ease.backOut);
		}
	}
}

Unit.prototype.hit = function(attacker, damage){
	if(this.status !== "death"){
		this.health -= damage;
		var damage_text = new OutlineText(damage,"bold 12px Arial",this.damage_color,"#000",4);
		this.addChild(damage_text);
		var dx = Math.random()*32-16;
		createjs.Tween.get(damage_text).to({x:dx/2,y:-32},200, createjs.Ease.cubicOut).to({x:dx, y:0},200, createjs.Ease.cubicIn).wait(200).call(function(item){
			this.removeChild(damage_text);
		},[],this);
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

Unit.prototype.gainExp = function(exp){
	this.exp += exp;
	while(this.exp >= this.level * 100){
		this.exp -= this.level * 100;
		this.level++;
	}

	if(this.type === "player" || this.type === "hero"){
		this.game.getUIStage().refreshExpBar();
	}
}

Unit.prototype.levelUp = function(){

}

Unit.prototype.die = function(attacker){
	this.status = "death";
	if(this.team === "enemy"){
		var allied_units = this.game.getUnitStage().getAlliedUnits(attacker);
		allied_units.forEach(function(unit){
			unit.gainExp(this.exp/allied_units.length);
		},this);
	}
	createjs.Tween.get(this).call(function(event){
		event.target.sprite.filters = [new createjs.ColorFilter(1,1,1,0)];
		event.target.sprite.cache(-12,-16,24,32);
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

Unit.prototype.findClosestEnemy = function(range){
	var self = this;
	var enemies = this.parent.parent.getEnemies(this);
	var min = null;
	enemies.forEach(function(enemy){
		if(enemy.status !== "death"){
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
		}
	},this);
	return min;
}

Unit.prototype.getSquareDistance = function(target){
	return Math.pow(this.x - target.x, 2)+Math.pow(this.y - target.y, 2);
}

Unit.prototype.tick = function(){
	switch(this.order.action){
		case "move":
		case "stop":
			this.procMove(this.x, this.y, this.game.getUnitStage().getUnitsExceptMe(this), this.order.map);
			break;
		case "attack":
			if(this.order.target && this.order.target.status !== "death"){
				if(this.getSquareDistance(this.order.target) <= Math.pow(this.range,2)){
					if(this.ticks > this.attack_speed){
						this.ticks = 0;
						this.attackTarget(this.order.target);
					}
				}else{
					this.procMove(this.x, this.y, this.game.getUnitStage().getUnitsExceptMe(this), this.order.map);
				}
			}
			break;
		case "guard":
		case "move_attack":
			if(this.order.target && this.order.target.status !== "death"){
				if(this.getSquareDistance(this.order.target) <= Math.pow(this.range,2)){
					if(this.ticks > this.attack_speed){
						this.ticks = 0;
						this.attackTarget(this.order.target);
					}
				}else{
					if(this.getSquareDistance(this.order.target) > Math.pow(this.aggro_radius,2)){
						this.order.target = null;
					}else{
						this.follow(this.order.target, this.game.getUnitStage().getUnitsExceptMe(this), this.order.map);
					}
				}
			}else{
				this.order.target = this.findClosestEnemy(this.aggro_radius);
				this.procMove(this.x, this.y, this.game.getUnitStage().getUnitsExceptMe(this), this.order.map);
			}
			break;
	}
	this.ticks++;
}