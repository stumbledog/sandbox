function Skill(builder){
	this.unit = builder.unit;
	this.key = builder.key;
	this.name = builder.name;
	this.description = builder.description;
	this.radius = builder.radius;
	this.type = builder.type;
	this.damage = builder.damage;
	this.cost = builder.cost;
	this.cooldown = builder.cooldown;
	this.angle = builder.angle;
	this.animation = builder.animation;
	this.effect = this.unit.unit_stage.getEffect();
}

Skill.prototype.useSkill = function(mouse_position){
	var current_position = new Vector(this.unit.x, this.unit.y);
	var mouse_vector = Vector.sub(mouse_position, current_position);
	mouse_vector.normalize();
	mouse_vector.mult(this.radius);

	var degree = mouse_vector.getDegree();
	this.enemies = this.unit.unit_stage.getEnemies(this.unit);
	console.log(this.type);
	switch(this.type){
		case "cone":
			if(this.unit.resource >= this.cost){
				this.unit.resource -= this.cost;
				if(this.unit.type === "hero"){
					this.unit.ui_stage.refreshResourceBar();
				}

				this.animate(degree);

				this.enemies.forEach(function(enemy){
					if(Vector.dist(this.unit, enemy) <= this.radius && mouse_vector.diffDegree(Vector.sub(enemy, current_position)) < this.angle/2){
						enemy.hit(this.unit, this.unit.damage * this.damage/100);
					}
				}, this);
			}
			break;
		case "impact":
			this.animate(degree);
			break;
		case "buff":
			
			break;
	}
}

Skill.prototype.animate = function(degree){
	this.effect.play(this.animation, this.unit.x, this.unit.y, degree);
}

Skill.prototype.renderArea = function(){

}

Skill.prototype.showDiscription = function(){

}

Skill.prototype.toggle = function(){

}

Skill.prototype.active = function(){

}