function ActiveSkill(skill, unit){
	this.active_skill_initialize(skill, unit);
}

ActiveSkill.prototype = new Skill();
ActiveSkill.prototype.constructor = ActiveSkill;

ActiveSkill.prototype.active_skill_initialize = function(skill, unit){
	this.initialize(skill, unit);

	this.effect = this.unit.unit_stage.getEffect();

	this.key = skill.key;
	this.target = skill.target;
	this.distance = skill.distance;
	this.radius = skill.radius;
	this.angle = skill.angle;
	this.type = skill.type;
	this.damage = skill.damage;
	this.cost = skill.cost;
	this.cooldown = skill.cooldown;
	this.duration = skill.duration;
	this.icon_source = skill.icon_source;
	this.animation = skill.animation;

	this.remain_cooldown = 0;

	if(this.name === "Chain Lightning"){
		this.unit.chain_lightning = true;
	}else if(this.name === "Backstab"){
		this.unit.backstab = true;
	}
}

ActiveSkill.prototype.use = function(mouse_position){
	if(this.unit.resource < this.cost){
		//alert("Not enough resource.");
		console.log("Not enough resource.");
	}else if(this.remain_cooldown > 0){
		//alert("This spell is not ready yet.");
		console.log("This spell is not ready yet.");
	}else{		
		this.unit.resource -= this.cost;
		this.remain_cooldown = this.cooldown * (100 - this.unit.cooldown_reduction)/100;
		this.enemies = this.unit.unit_stage.getEnemies(this.unit);
		switch(this.name){
			case "Charge":
				this.charge(mouse_position);
				break;
			case "Shockwave":
				this.shockwave(mouse_position);
				break;
			case "Bladestorm":
				this.Bladestorm();
				break;
			case "Last Defender":
				this.lastDefender();
				break;
			case "Judgement":
				this.judgement(mouse_position);
				break;
			case "Fireball":
				this.fireball(mouse_position);
				break;
		}
		if(this.unit.constructor.name === "Hero"){
			this.ui_stage.refreshResourceBar()
		}
	}
}

ActiveSkill.prototype.useOnTarget = function(target){
	var target = this.unit.skill_target ? this.unit.skill_target : target;
	if(!target){
		console.log("Hover the pointer over its target");
	}else if(this.unit.resource < this.cost){
		console.log("Not enough resource.");
	}else if(this.remain_cooldown > 0){
		console.log("This spell is not ready yet.");
	}else if(Math.sqrt(this.unit.getSquareDistance(target)) > this.distance){
		console.log("Out of range");
	}else{
		this.unit.resource -= this.cost;
		this.remain_cooldown = this.cooldown * (100 - this.unit.cooldown_reduction)/100;
		this.enemies = this.unit.unit_stage.getEnemies(this.unit);

		switch(this.name){
			case "Chain Lightning":
				this.chainLightning(target);
				break;
			case "Backstab":
				this.backstab(target);
				break;
		}

		if(this.unit.constructor.name === "Hero"){
			this.ui_stage.refreshResourceBar()
		}
	}
}

ActiveSkill.prototype.fireball = function(mouse_position){

}

ActiveSkill.prototype.charge = function(mouse_position){
	var distance = Math.sqrt(this.unit.getSquareDistance(mouse_position));

	if(this.distance < distance){
		var unit_x = (mouse_position.x - this.unit.x) * this.distance / distance / 10;
		var unit_y = (mouse_position.y - this.unit.y) * this.distance / distance / 10;
		distance = this.distance;
	}else{
		var unit_x = (mouse_position.x - this.unit.x) / 10;
		var unit_y = (mouse_position.y - this.unit.y) / 10;
	}
	
	var arrival = new Vector(this.unit.x, this.unit.y);
	var destination = new Vector(0, 0);

	for(var i = 1; i <11 ; i++){
		var x = parseInt(unit_x * i);
		var y = parseInt(unit_y * i);
		if(this.unit.blocks[parseInt((this.unit.y + y)/16)] && 
			this.unit.blocks[parseInt((this.unit.y + y)/16)][parseInt((this.unit.x + x)/16)] === 'E'){
			destination = new Vector(x, y);
		}
	}

	destination.add(arrival);
	this.unit.invincibility = true;
	this.unit.moveAttack(destination.x, destination.y);
	createjs.Tween.get(this.unit)
		.to({x:destination.x, y:destination.y}, distance * 3)
		.call(function(){
			this.unit.invincibility = false;
			this.enemies.forEach(function(enemy){
				var enemy_position = new Vector(enemy.x, enemy.y);
				var diff = enemy_position.distToSegment(arrival, destination);
				if(diff <= this.radius){
					enemy.hit(this.unit, this.unit.getDamage("skill", this.damage));
				}
			}, this);
		}.bind(this));
}

ActiveSkill.prototype.shockwave = function(mouse_position){
	var current_position = new Vector(this.unit.x, this.unit.y);
	var mouse_vector = Vector.sub(mouse_position, current_position);
	mouse_vector.normalize();
	mouse_vector.mult(this.radius);
	var degree = mouse_vector.getDegree();
	this.effect.play(this.animation, this.unit.x, this.unit.y, degree);
	this.enemies.forEach(function(enemy){
		if(Vector.dist(this.unit, enemy) <= this.radius && mouse_vector.diffDegree(Vector.sub(enemy, current_position)) < this.angle/2){
			enemy.hit(this.unit, this.unit.getDamage("skill", this.damage));
		}
	}, this);
}

ActiveSkill.prototype.Bladestorm = function(){
	this.effect.play(this.animation, this.unit.x, this.unit.y, this.animation.rotate);
	this.enemies.forEach(function(enemy){
		if(Vector.dist(this.unit, enemy) <= this.radius){
			enemy.hit(this.unit, this.unit.getDamage("skill", this.damage));
		}
	}, this);
}

ActiveSkill.prototype.lastDefender = function(){
	this.unit.last_defender = true;
	this.unit.updateStats();

	this.effect.playOnUnit(this.animation, this.unit);

	setTimeout(function(){ 
		this.unit.last_defender = false;
		this.unit.updateStats();
	}.bind(this), this.duration);
}

ActiveSkill.prototype.judgement = function(mouse_position){
	var distance = Math.sqrt(this.unit.getSquareDistance(mouse_position));

	if(this.distance < distance){
		var unit_x = (mouse_position.x - this.unit.x) * this.distance / distance / 10;
		var unit_y = (mouse_position.y - this.unit.y) * this.distance / distance / 10;
		distance = this.distance;
	}else{
		var unit_x = (mouse_position.x - this.unit.x) / 10;
		var unit_y = (mouse_position.y - this.unit.y) / 10;
	}
	
	var arrival = new Vector(this.unit.x, this.unit.y);
	var destination = new Vector(0, 0);

	for(var i = 1; i <11 ; i++){
		var x = parseInt(unit_x * i);
		var y = parseInt(unit_y * i);
		if(this.unit.blocks[parseInt((this.unit.y + y)/16)] && 
			this.unit.blocks[parseInt((this.unit.y + y)/16)][parseInt((this.unit.x + x)/16)] === 'E'){
			destination = new Vector(x, y);
		}
	}

	destination.add(arrival);
	this.unit.invincibility = true;
	createjs.Tween.get(this.unit)
		.to({regY: 200}, 200, createjs.Ease.circOut)
		.call(function(){
			this.unit.visible = false;
		}.bind(this))
		.to({x:destination.x,y:destination.y}, 300)
		.call(function(){
			this.unit.visible = true;
			this.effect.play(this.animation, this.unit.x, this.unit.y, -90);
		}.bind(this))
		.to({regY: 0}, 200, createjs.Ease.circIn)
		.call(function(){
			this.unit.invincibility = false;
			this.unit.moveAttack(destination.x, destination.y);
			this.enemies.forEach(function(enemy){
				if(Vector.dist(this.unit, enemy) <= this.radius){
					enemy.hit(this.unit, this.unit.getDamage("skill", this.damage));
					var v = new Vector(enemy.x, enemy.y);
					v.sub(new Vector(this.unit.x, this.unit.y)).normalize().mult(50);
					createjs.Tween.get(enemy)
						.to({x:enemy.x + v.x/2, y:enemy.y + v.y/2}, 500)
						.to({x:enemy.x + v.x/2, y:enemy.y + v.y/2}, 500);
				}
			}, this);
		}.bind(this));
}

ActiveSkill.prototype.chainLightning = function(target){
	var temp;
	var counter = 0;
	var prev_target = this.unit;
	var interval = setInterval(function(){
		target.hit(this.unit, this.unit.getDamage("skill", this.damage));
		this.effect.play(this.animation, target.x, target.y, 90);
		temp = target.findClosestAlly(this.distance);
		prev_target = target;
		target = temp;
		
		counter++;
		if(counter === 5 || !target) {
			clearInterval(interval);
		}
	}.bind(this), 200);
}

ActiveSkill.prototype.backstab = function(target){
	this.unit.invincibility = true;
	this.unit.x = target.x;
	this.unit.y = target.y;
	this.effect.play(this.animation, target.x, target.y, -90);
	target.hit(this.unit, this.unit.getDamage("skill", this.damage));
	/*
	this.unit.hide();

	this.unit.alpha = 0.5;
	this.hide = true;
	*/
}