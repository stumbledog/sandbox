function Skill(builder){
	this.unit = builder.unit;
	this.key = builder.key;
	this.name = builder.name;
	this.description = builder.description;
	this.range = builder.range;
	this.type = builder.type;
	this.damage = builder.damage;
	this.cost = builder.cost;
	this.cooldown = builder.cooldown;
	this.container = this.unit.unit_stage.effect_container;
	this.angle = builder.angle;
}

Skill.prototype.useSkill = function(mouse_position){
	var current_position = new Vector(this.unit.x, this.unit.y);
	var mouse_vector = Vector.sub(mouse_position, current_position);
	mouse_vector.normalize();
	mouse_vector.mult(this.range);
	var angle = mouse_vector.getRadian();
	this.enemies = this.unit.unit_stage.getEnemies(this.unit);

	switch(this.type){
		case "cone":
			if(this.unit.resource >= this.cost){
				this.unit.resource -= this.cost;
				if(this.unit.type === "hero"){
					this.unit.ui_stage.refreshResourceBar();
				}
				this.enemies.forEach(function(enemy){
					if(Vector.dist(this.unit, enemy) <= this.range && mouse_vector.diffDegree(Vector.sub(enemy, current_position)) < this.angle/2){
						enemy.hit(this.unit, this.unit.damage * this.damage/100);
					}
				}, this);
			}
			break;
	}
}

Skill.prototype.renderArea = function(){

}

Skill.prototype.showDiscription = function(){

}

Skill.prototype.toggle = function(){

}

Skill.prototype.active = function(){

}