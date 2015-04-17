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
	this.icon_source = skill.icon_source;
	this.animation = skill.animation;

	this.remain_cooldown = 0;
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
			case "Fireball":
				this.fireball(mouse_position);
				break;
		}
		if(this.unit.constructor.name === "Hero"){
			this.ui_stage.refreshResourceBar()
		}
	}
}

ActiveSkill.prototype.useOnTarget = function(){
	if(!this.unit.skill_target){
		console.log("Hover the pointer over its target");
	}else if(this.unit.resource < this.cost){
		console.log("Not enough resource.");
	}else if(this.remain_cooldown > 0){
		console.log("This spell is not ready yet.");
	}else if(Math.sqrt(this.unit.getSquareDistance(this.unit.skill_target)) > this.radius){
		console.log("Out of range");
	}else{
		this.unit.resource -= this.cost;
		this.remain_cooldown = this.cooldown * (100 - this.unit.cooldown_reduction)/100;
		this.enemies = this.unit.unit_stage.getEnemies(this.unit);

		switch(this.name){
			case "Charge":
				this.charge(this.unit.skill_target);
				break;
			case "Fireball":
				this.fireball(this.unit.skill_target);
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
	
	var destination = {x:0,y:0};

	for(var i = 1; i <11 ; i++){
		var x = parseInt(unit_x * i);
		var y = parseInt(unit_y * i);
		console.log(this.unit.blocks[parseInt((this.unit.y + y)/16)][parseInt((this.unit.x + x)/16)]);
		if(this.unit.blocks[parseInt((this.unit.y + y)/16)] && 
			this.unit.blocks[parseInt((this.unit.y + y)/16)][parseInt((this.unit.x + x)/16)] === 'E'){
			destination = {x:x, y:y};
		}
	}

	

	this.unit.moveAttack(this.unit.x + destination.x, this.unit.y + destination.y);
	createjs.Tween.get(this.unit)
		.to({x:this.unit.x + destination.x, y:this.unit.y + destination.y}, distance * 3)
		.call(function(){
			this.enemies.forEach(function(enemy){
				if(Vector.dist(this.unit, enemy) <= this.radius && mouse_vector.diffDegree(Vector.sub(enemy, current_position)) < this.angle/2){
					enemy.hit(this.unit, this.getSkillDamage());
				}
			}, this);
			//console.log(this.unit.blocks[parseInt(mouse_position.y/16)][parseInt(mouse_position.x/16)]);
			//if()
			//mouse_position.hit(this.unit, this.getSkillDamage());
			//this.unit.moveAttack(this.unit.x, this.unit.y);
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
			enemy.hit(this.unit, this.getSkillDamage());
		}
	}, this);
}

ActiveSkill.prototype.Bladestorm = function(){
	this.effect.play(this.animation, this.unit.x, this.unit.y, this.animation.rotate);
	this.enemies.forEach(function(enemy){
		if(Vector.dist(this.unit, enemy) <= this.radius){
			enemy.hit(this.unit, this.getSkillDamage());
		}
	}, this);
}

ActiveSkill.prototype.getSkillDamage = function(){
	var damage = this.unit.dps * this.damage/100;
	if(this.unit.critical_rate/100 >= Math.random()){
		return {damage:(2 + this.unit.critical_damage / 100) * damage, critical:true};
	}else{
		return {damage:damage, critical:false};
	}

}