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
		alert("Not enough resource.");
	}else if(this.remain_cooldown > 0){
		alert("This spell is not ready yet.");
	}else{		
		this.unit.resource -= this.cost;
		this.remain_cooldown = this.cooldown * (100 - this.unit.cooldown_reduction)/100;
		this.enemies = this.unit.unit_stage.getEnemies(this.unit);
		switch(this.name){
			case "Charge":
				this.charge();
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
		alert("Hover the pointer over its target");
	}else if(this.unit.resource < this.cost){
		alert("Not enough resource.");
	}else if(this.remain_cooldown > 0){
		alert("This spell is not ready yet.");
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

ActiveSkill.prototype.charge = function(target){
	console.log("charge");
	var distance = Math.sqrt(this.unit.getSquareDistance(target));

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