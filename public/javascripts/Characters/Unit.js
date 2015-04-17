function Unit(){}

Unit.prototype = new createjs.Container();
Unit.prototype.constructor = Unit;
Unit.prototype.container_initialize = Unit.prototype.initialize;

Unit.prototype.initialize = function(builder){
	this.container_initialize();
	this.game = Game.getInstance();
	this.loader = this.game.getLoader();
	this.user = this.game.getUser();
	this.map_stage = this.game.getMapStage();
	this.unit_stage = this.game.getUnitStage();
	this.ui_stage = this.game.getUIStage();

	this.blocks = this.game.getMapStage().getBlock();
	this.ticks = 0;

	this.x = builder.x;
	this.y = builder.y;
	this.name = builder.name;

	this.health_regen = 0;
	this.resource_regen = 0;
	this.armor = 0;
	this.life_steal = 0;

	this.dps = 0;
	this.min_damage = 0;
	this.max_damage = 0;
	this.attack_speed = 0;
	this.critical_rate = 0;
	this.critical_damage = 0;

	this.cooldown_reduction = 0;
	this.movement_speed = 0;

	this.aggro_radius = 80;

	this.stats = {};
	this.items = [];

	this.max_force = 0.3;
	this.status = "alive";
	this.target = null;
	this.filter = null;

	this.velocity = new Vector(0,0);

	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.renderUnit(builder.sprite.split('/').pop(), builder.index, builder.regX, builder.regY);
}

Unit.prototype.getDamage = function(type, multiplier){
	switch(type){
		case "right":
			var damage = Math.random() * (this.right_max_damage - this.right_min_damage) + this.right_min_damage;
			break;
		case "left":
			var damage = Math.random() * (this.left_max_damage - this.left_min_damage) + this.left_min_damage;
			break;
		case "skill":
			var damage = Math.random() * (this.left_max_damage + this.right_max_damage - this.left_min_damage - this.right_min_damage) + this.left_min_damage + this.right_min_damage;
			damage *= multiplier;
			break;
	}
	if(this.critical_rate/100 >= Math.random()){
		return {damage:(2 + this.critical_damage / 100) * damage, critical:true};
	}else{
		return {damage:damage, critical:false};
	}
}

Unit.prototype.useSkill = function(key, mouse_position){
	if(this.active_skills[key].target){
		this.active_skills[key].useOnTarget();
	}else{
		this.active_skills[key].use(mouse_position);
	}
}

Unit.prototype.renderUnit = function(src_id, index, regX, regY){
	regX = typeof regX !== 'undefined' ? regX : 0;
	regY = typeof regY !== 'undefined' ? regY : 0;

	var frames = [];
	for(var i=0 ;i < 12; i++){
		frames.push([index % 4 * 72 + (i % 3) * 24, parseInt(index / 4) * 128 + parseInt(i / 3) * 32 + 1, 23, 31, 0, 12, 16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.loader.getResult(src_id)],
		frames:frames,
		animations:{
			front:{
				frames:[0,1,2,1],
			},
			left:{
				frames:[3,4,5,4],
			},
			right:{
				frames:[6,7,8,7],
			},
			back:{
				frames:[9,10,11.10],
			},
			stop:{
				frames:[1]
			}
		}
	});
	this.sprite = new createjs.Sprite(spriteSheet);
	this.sprite.regX = regX;
	this.sprite.regY = regY;
	this.sprite.z = 0;
	this.outline = this.sprite.clone();
	this.outline.scaleX = this.outline.scaleY = 1.1;
	this.outline.visible = false;
	this.addChild(this.outline, this.sprite);
}

Unit.prototype.renderPortrait = function(portrait_id, index){
	this.portrait = new createjs.Bitmap(this.loader.getResult(portrait_id));
	this.portrait.sourceRect = new createjs.Rectangle(index % 4 * 96, parseInt(index / 4) * 96, 96, 96);
}

Unit.prototype.getPortrait = function(){
	return this.portrait.clone();
}

Unit.prototype.getSprite = function(){
	return this.sprite.clone();
}

Unit.prototype.initHealthBar = function(){
	this.health_bar_border = new createjs.Shape();
	this.health_bar_border.graphics.s("#fff").ss(2).f("#fff").rr(-12,-16,24,4,1);
	this.health_bar = new createjs.Shape();
	this.health_bar.graphics.f(this.health_color).dr(-11,-15,22,2);
	this.addChild(this.health_bar_border, this.health_bar);
}

Unit.prototype.renderHealthBar = function(){
	this.health_bar.graphics.c().f(this.health_color).dr(-11,-15,22*(this.health/this.max_health),2);
}

Unit.prototype.findPath = function(destination){
	return PathFinder.flowField(this.blocks, destination);
}

Unit.prototype.move = function(x, y){
	this.order.action = "move";
	this.order.map = this.findPath({x:x,y:y});
}

Unit.prototype.stop = function(){
	this.order.action = "stop";
	this.order.map = this.findPath({x:this.x,y:this.y});
}

Unit.prototype.moveAttack = function(x, y){
	this.order.action = "move_attack";
	this.target = null;
	this.target_map = null;
	this.order.map = this.findPath({x:x,y:y});
}

Unit.prototype.attack = function(target){
	this.order.action = "attack";
	this.order.target = target;
	this.order.map = this.findPath({x:target.x,y:target.y});
}

Unit.prototype.procMove = function(map){
	if(!map){
		return;
	}
	var units = this.unit_stage.getUnits();
	var sep = this.separate(units);
	var ali = this.align(units);
	var coh = this.cohesion(units);
	var flo = this.flowField(map);

	sep.mult(2.0);
	ali.mult(0.5);
	coh.mult(1.0);
	flo.mult(2.0);

	this.velocity.add(sep);
	this.velocity.add(ali);
	this.velocity.add(coh);
	this.velocity.add(flo);
	this.velocity.limit(this.movement_speed);

	var indexX = Math.floor(this.x / 16);
	var indexY = Math.floor(this.y / 16);
	var indexVX = Math.floor((this.x + this.velocity.x)/ 16);
	var indexVY = Math.floor((this.y + this.velocity.y)/ 16);

	if(!map[indexVY] || !map[indexVY][indexVX] || map[indexVY][indexVX].block){
		if(map[indexY][indexVX] && !map[indexY][indexVX].block){
			this.velocity.y = 0;
		}else if(map[indexVY] && !map[indexVY][indexX].block){
			this.velocity.x = 0;
		}else{
			this.velocity.mult(0);
		}
	}

	this.x += this.velocity.x;
	this.y += this.velocity.y;

	if(this.ticks % 8 === 0){
		this.rotate(this.velocity.x, this.velocity.y);
	}
}

Unit.prototype.separate = function(units){
	var steer = new Vector(0,0);
	var count = 0;
	units.forEach(function(unit){
		var distance = Vector.dist(this, unit);
		if(distance > 0 && distance < this.radius + unit.radius){
			var diff = Vector.sub(this, unit);
			diff.normalize();
			diff.div(distance);
			steer.add(diff);
			count++;
		}
	}, this);

	if(count > 0){
		steer.div(count);
		steer.normalize();
		steer.mult(this.movement_speed);
		steer.sub(this.velocity);
		steer.limit(this.max_force);
	}
	return steer;
}

Unit.prototype.align = function(units){
	var neighbor_distance = 64;
	var sum = new Vector(0,0);
	var count = 0;
	units.forEach(function(unit){
		var distance = Vector.dist(this, unit);
		if(distance > 0 && distance < neighbor_distance && this.team === unit.team){
			sum.add(unit.velocity);
			count++;
		}
	});

	if(count > 0){
		sum.duv(count);
		sum.normalize();
		sum.mult(this.movement_speed);
		var steer = Vector.sub(sum, this.velocity);
		steer.limit(this.max_force);
		return steer;
	}else{
		return new Vector(0,0);
	}
}

Unit.prototype.cohesion = function(units){
	var sum = new Vector(0,0);
	var count = 0;
	units.forEach(function(unit){
		var distance = Vector.dist(this, unit);
		if(distance > 0 && distance < this.radius + unit.radius){
			sum.add(unit);
			count++;
		}
	});

	if(count > 0){
		sum.div(count);
		var desired = Vector.sub(target, this);
		desired.normalize();
		desired.mult(this.movement_speed);
		var steer = Vector.sub(desired, this.velocity);
		steer.limit(this.max_force);
		return steer;
	}else{
		return new Vector(0,0);
	}
}

Unit.prototype.flowField = function(map){
	var desired = map[Math.floor(this.y / 16)][Math.floor(this.x / 16)].v;
	desired.normalize();
	desired.mult(this.movement_speed);
	if(desired.mag() === 0){
		this.velocity.mult(0);
		return new Vector(0,0);
	}
	var steer = Vector.sub(desired, this.velocity);
	steer.limit(this.max_force);
	return steer;
}

Unit.prototype.rotate = function(dx, dy){
	if(!dx && !dy) return;

	if(Math.abs(dx) > Math.abs(dy)){
		if(dx > 0){
			if(this.direction === "right") return;
			this.direction = "right";
		}else{
			if(this.direction === "left") return;
			this.direction = "left";
		}
	}else{
		if(dy < 0){
			if(this.direction === "back") return;
			this.direction = "back";
		}else{
			if(this.direction === "front") return;
			this.direction = "front";
		}
	}

	this.sprite.gotoAndPlay(this.direction);
	this.outline.gotoAndPlay(this.direction);

	this.sprite._animation.speed = this.movement_speed / 5;
}

Unit.prototype.attackTarget = function(target, hand){
	if(this.resource_type === "fury"){
		this.resource += 5;
		this.resource = this.resource > this.max_resource ? this.max_resource : this.resource;
	}

	if(this.equipments){
		var weapon = hand === "right" ? this.equipments.main_hand : this.equipments.off_hand;
	}else{
		var weapon = null;
	}

	var attack_speed = hand === "right" ? this.right_attack_speed : this.left_attack_speed;		

	this.rotate(target.x - this.x, target.y - this.y);

	if(weapon){
		if(weapon.attack_type === "melee"){
			target.addChild(weapon.bitmap);
			weapon.bitmap.x = this.x > target.x ? 8 : -8;
			weapon.bitmap.scaleX = this.x > target.x ? weapon.bitmap.scaleY : -weapon.bitmap.scaleY;
			weapon.bitmap.rotation = 0;
			createjs.Tween.get(weapon.bitmap)
				.to({rotation:this.x > target.x ? -90 : 90},attack_speed * 5, createjs.Ease.backOut)
				.call(function(){
					target.hit(this, this.getDamage(hand));
					target.removeChild(weapon.bitmap);
				}.bind(this));
		}else if(weapon.attack_type === "range"){
			var distance = Math.sqrt(this.getSquareDistance(target));
			var projectile = new createjs.Bitmap(this.loader.getResult(weapon.projectile.source.split('/').pop()));
			projectile.sourceRect = new createjs.Rectangle(parseInt(weapon.projectile.cropX),parseInt(weapon.projectile.cropY),parseInt(weapon.projectile.width),parseInt(weapon.projectile.height));
			projectile.regX = weapon.projectile.regX;
			projectile.regY = weapon.projectile.regY;
			projectile.scaleX = projectile.scaleY = weapon.projectile.scale;
			projectile.spin = weapon.projectile.spin;
			this.addChild(projectile);
			createjs.Tween.get(projectile)
				.to({x:target.x - this.x,y:target.y - this.y, rotation: projectile.spin * distance}, distance * 3)
				.call(function(){
					target.hit(this, this.getDamage(hand));
					this.removeChild(projectile);
				}.bind(this));
		}
	}else{
		createjs.Tween.get(this.sprite)
			.to({y:-8},attack_speed * 5, createjs.Ease.backOut)
			.call(function(){
				target.hit(this, this.getDamage(hand));
			}.bind(this))
			.to({y:0},attack_speed * 5, createjs.Ease.backOut);
		createjs.Tween.get(this.outline)
			.to({y:-8},attack_speed * 5, createjs.Ease.backOut)
			.to({y:0},attack_speed * 5, createjs.Ease.backOut);
	}
}

Unit.prototype.hit = function(attacker, damage_object){
	if(this.resource_type === "fury"){
		this.resource += 1;
		this.resource = this.resource > this.max_resource ? this.max_resource : this.resource;
	}

	if(this.status !== "death" && !this.invincibility){
		var damage = (1 - this.damage_reduction) * damage_object.damage;
		this.health -= damage;
		var font_size = damage_object.critical ? "16" : "12";
		var outline = damage_object.critical ? "4" : "2";
		var damage_text = new OutlineText(Math.round(damage),"bold "+font_size+"px Arial",attacker.damage_color,"#000",outline);
		damage_text.x = this.x;
		damage_text.y = this.y;
		this.getStage().addChild(damage_text);
		var dx = Math.random() * 32-16;
		var dy = Math.random() * 16;
		var stage = this.getStage();
		createjs.Tween.get(damage_text).to({x:this.x + dx,y:this.y - 32 - dy},500, createjs.Ease.cubicOut).wait(500).call(function(item){
			stage.removeChild(damage_text);
		});
		if(this.health <= 0){
			this.die(attacker);
		}else{
			createjs.Tween.get(this).call(function(event){
				event.target.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
				event.target.sprite.cache(-12,-16,24,32);
			}).wait(200).call(function(event){
				event.target.sprite.filters = null;
				event.target.sprite.uncache();
			});
		}
		this.renderHealthBar();
	}
}

Unit.prototype.heal = function(heal){
	this.health = this.health + heal > this.max_health ? this.max_health : this.health + heal;
	var health_text = new OutlineText(Math.floor(heal), "bold 10px Arial", this.health_color, "#000", 2);
	health_text.x = this.x;
	health_text.y = this.y;
	this.getStage().addChild(health_text);
	var dx = Math.random() * 32-16;
	var stage = this.getStage();
	createjs.Tween.get(health_text).to({x:this.x + dx,y:this.y - 32},500, createjs.Ease.cubicOut).wait(500).call(function(item){
		stage.removeChild(health_text);
	});
	this.renderHealthBar();
}

Unit.prototype.regenerate_resource = function(regen){
	regen = this.resource_type === "fury" ? regen - 3 : regen;
	this.resource = this.resource + regen > this.max_resource ? this.max_resource : this.resource + regen < 0 ? 0 : this.resource + regen;

}

Unit.prototype.gainXP = function(exp){
	this.exp += exp;
	var exp_text = new OutlineText("+" + Math.round(exp)+" exp","bold 8px Arial","#fff","#000",2);
	exp_text.x = -exp_text.getMeasuredWidth()/2;
	this.addChild(exp_text);

	createjs.Tween.get(exp_text).to({y:-28},1000, createjs.Ease.cubicOut).wait(500).call(function(item){
		this.removeChild(exp_text);
	},[],this);

	while(this.exp >= this.level * 100){
		this.exp -= this.level * 100;
		this.levelUp();
	}
}

Unit.prototype.levelUp = function(){
	this.level++;
	this.heal(this.max_health/10);
	this.char_strength += parseInt(this.level_up_bonus.strength);
	this.char_agility += parseInt(this.level_up_bonus.agility);
	this.char_intelligence += parseInt(this.level_up_bonus.intelligence);
	this.char_stamina += parseInt(this.level_up_bonus.stamina);
	this.updateStats();
	console.log(this);
	var levelup_text = new OutlineText("Level Up","bold 10px Arial","#E9A119","#000",2);
	levelup_text.x = -levelup_text.getMeasuredWidth()/2;
	this.addChild(levelup_text);
	createjs.Tween.get(levelup_text).to({y:-42},1000, createjs.Ease.cubicOut).wait(500).call(function(item){
		this.removeChild(levelup_text);
	},[],this);
}

Unit.prototype.die = function(attacker){
	this.health = 0;
	this.status = "death";
	this.removeChild(this.outline);
	createjs.Tween.get(this).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,0));
	}).wait(300).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,1));
	}).wait(300).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,0));
	}).wait(200).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,1));
	}).wait(200).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,0));
	}).wait(100).call(function(event){
		die_animation(event.target, new createjs.ColorFilter(1,1,1,1));
	}).wait(100).call(function(event){
		event.target.getStage().removeUnit(event.target);
	});

	function die_animation(unit, filter){
		unit.sprite.uncache();
		unit.sprite.filters = [filter];
		unit.sprite.cache(-12,-16,24,32);
	}
}

Unit.prototype.findClosestAlly = function(range){
	var allies = this.unit_stage.getAlliedUnits(this);
	var min = null;
	allies.forEach(function(ally){
		if(ally.status !== "death" && this !== ally){
			ally.distance = this.getSquareDistance(ally);
			if(range){
				if(ally.distance < Math.pow(range,2))
				if((!min || ally.distance < min.distance) && ally.distance < Math.pow(range,2)){
					min = ally;
				}
			}else{
				if((!min || ally.distance < min.distance)){
					min = ally;
				}
			}
		}
	},this);
	return min;
}

Unit.prototype.findClosestEnemy = function(range){
	var enemies = this.unit_stage.getEnemies(this);
	var min = null;
	enemies.forEach(function(enemy){
		if(enemy.status !== "death"){
			enemy.distance = this.getSquareDistance(enemy);
			if(range){
				if(enemy.distance < Math.pow(range,2))
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

Unit.prototype.attackTick = function(){
	if(this.order.target && this.order.target.status !== "death"){
		if(this.getSquareDistance(this.order.target) <= Math.pow(this.range + this.radius + this.order.target.radius,2)){
			this.velocity = new Vector(0,0);

			if(this.right_weapon_tick > this.right_attack_speed){
				this.right_weapon_tick = 0 ;
				this.attackTarget(this.order.target, "right");
			}

			if(this.left_weapon_tick && this.left_weapon_tick > this.left_attack_speed){
				this.left_weapon_tick = 0 ;
				this.attackTarget(this.order.target, "left");
			}
		}else{
			this.procMove(this.order.map);
		}
	}	
}

Unit.prototype.moveAttackTick = function(distance){
	if(this.target && this.target.status !== "death"){
		if(this.getSquareDistance(this.target) <= Math.pow(this.range + this.radius + this.target.radius,2)){
			this.velocity = new Vector(0,0);

			if(this.right_weapon_tick > this.right_attack_speed){
				this.right_weapon_tick = 0 ;
				this.attackTarget(this.target, "right");
			}

			if(this.left_weapon_tick && this.left_weapon_tick > this.left_attack_speed){
				this.left_weapon_tick = 0 ;
				this.attackTarget(this.target, "left");
			}
		}else{
			if(this.ticks % 30 === 0 || !this.target_map){
				this.target = this.findClosestEnemy(this.aggro_radius + this.range) || this.target;
				this.target_map = this.findPath({x:this.target.x,y:this.target.y});
			}
			this.procMove(this.target_map);
		}
	}else{
		this.target_map = null;
		this.target = this.findClosestEnemy(distance);
		this.procMove(this.order.map);
	}	
}

Unit.prototype.interactNPC = function(){
	if(this.getSquareDistance(this.order.npc) <= Math.pow(this.radius + this.order.npc.radius + 4, 2)){
		this.velocity = new Vector(0,0);
		this.order.npc.interact(this);
		this.order.action = "stop";
		this.order.map = this.findPath({x:this.x,y:this.y});
	}else{
		this.procMove(this.order.map);
	}
}

Unit.prototype.castSpell = function(){
	if(this.chain_lightning && this.order.action !== "move" && this.order.action !== "stop"){
		var spell = this.active_skills["chain_lightning"];
		var target = this.findClosestEnemy(spell.distance);
		if(target && spell.remain_cooldown === 0){
			this.active_skills["chain_lightning"].useOnTarget(target);
		}
	}

	if(this.backstab && this.order.action !== "move" && this.order.action !== "stop"){
		var spell = this.active_skills["backstab"];
		var target = this.findClosestEnemy(spell.distance);
		if(target && spell.remain_cooldown === 0){
			this.active_skills["backstab"].useOnTarget(target);
		}
	}
}

Unit.prototype.tick = function(){
	switch(this.order.action){
		case "move":
		case "stop":
			this.procMove(this.order.map);
			break;
		case "attack":
			this.attackTick();
			break;
		case "guard":
		case "move_attack":
			this.moveAttackTick(this.aggro_radius + this.range);
			break;
		case "annihilate":
			this.moveAttackTick(null);
			break;
		case "interact_npc":
			this.interactNPC();
			break;
	}

	if(this.filter === "uncache"){
		this.sprite.uncache();
		this.filter = null;
	}else if(this.filter){
		this.sprite.uncache();
		this.sprite.filters = this.filter;
		this.sprite.cache(-12,-16,24,32);
	}

	if(this.health_regen && this.ticks % 300 === 0){
		this.heal(this.health_regen);
	}

	if(this.resource_regen && this.ticks % 60 === 0){
		this.regenerate_resource(this.resource_regen);
	}

	this.castSpell();

	this.ticks++;
	this.right_weapon_tick++;
	if(this.left_weapon_tick >= 0){
		this.left_weapon_tick++;
	}
}