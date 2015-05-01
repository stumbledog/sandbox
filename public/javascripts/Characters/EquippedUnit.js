function EquippedUnit(builder){
	this.equipped_unit_initialize(builder);
}

EquippedUnit.prototype = new Unit();
EquippedUnit.prototype.constructor = EquippedUnit;
EquippedUnit.prototype.unit_initialize = EquippedUnit.prototype.initialize;

EquippedUnit.prototype.equipped_unit_initialize = function(builder){
	this.unit_initialize(builder);

	this.character_class = builder.character_class;
	this.primary_attribute = builder.model.primary_attribute;
	this.char_strength = builder.model.strength;
	this.char_agility = builder.model.agility;
	this.char_intelligence = builder.model.intelligence;
	this.char_stamina = builder.model.stamina;
	this.char_movement_speed = 1;

	this.level = builder.level;
	this.exp = builder.exp;

	this.resource_type = builder.model.resource_type;
	this.level_up_bonus = builder.level_up_bonus;

	this.max_health = this.health = 10;
	this.max_resource = 100;

	if(this.resource_type === "fury"){
		this.resource = 0;
	}else{
		this.resource = 100;
	}

	this.passive_skills = [];
	this.active_skills = {};

	builder.model.passive_skills.forEach(function(skill){
		this.passive_skills.push(new PassiveSkill(skill, this));
	}, this);


	builder.model.active_skills.forEach(function(skill){
		this.active_skills[skill.key] = new ActiveSkill(skill, this);
	}, this);

	this.char_max_resource = 100;
	this.char_radius = 12;
	this.aggro_radius = 80;
	this.char_range = 16;
	this.char_right_attack_speed = 60;

	this.equipments = {
		head:null,
		chest:null,
		gloves:null,
		boots:null,
		belt:null,
		cape:null,
		necklace:null,
		right_ring:null,
		left_ring:null,
		main_hand:null,
		off_hand:null,
	}

	if(builder.equipments.length){
		this.initItems(builder.equipments);
	}

	this.updateStats();
}

EquippedUnit.prototype.initItems = function(builder_items){
	builder_items.forEach(function(item){
		if(item.weapon){
			var weapon = new Weapon(item.weapon);
			weapon.bin = this;
			this.equipments[item.part] = weapon;
		}else{
			var armor = new Armor(item.armor);
			armor.bin = this;
			this.equipments[item.part] = armor;
		}
	}, this);
}

EquippedUnit.prototype.updateStats = function(){
	this.critical_rate = 0;
	this.critical_damage = 0;

	this.dps = 0;

	this.health_regen = 0;
	this.resource_regen = 0;
	this.armor = 0;
	this.life_steal = 0;

	this.cooldown_reduction = 0;

	if(this.equipments.main_hand){
		this.right_weapon_tick = 0;
		this.right_attack_speed = this.equipments.main_hand.attack_speed;
		this.right_min_damage = this.equipments.main_hand.attributes.min_damage_bonus ? this.equipments.main_hand.min_damage + parseFloat(this.equipments.main_hand.attributes.min_damage_bonus) : parseFloat(this.equipments.main_hand.min_damage);
		this.right_max_damage = this.equipments.main_hand.attributes.max_damage_bonus ? this.equipments.main_hand.max_damage + parseFloat(this.equipments.main_hand.attributes.max_damage_bonus) : parseFloat(this.equipments.main_hand.max_damage);
		this.range = this.equipments.main_hand.range;
	}else{
		this.right_weapon_tick = 0;
		this.right_attack_speed = 60;
		this.right_min_damage = 1;
		this.right_max_damage = 2;
		this.range = 16;
	}

	if(this.equipments.off_hand && this.equipments.off_hand.type === "weapon"){
		this.left_weapon_tick = 0;
		this.left_attack_speed = this.equipments.off_hand.attack_speed;
		this.left_min_damage = this.equipments.off_hand.attributes.min_damage_bonus ? this.equipments.off_hand.min_damage + parseFloat(this.equipments.off_hand.attributes.min_damage_bonus) : parseFloat(this.equipments.off_hand.min_damage);
		this.left_max_damage = this.equipments.off_hand.attributes.max_damage_bonus ? this.equipments.off_hand.max_damage + parseFloat(this.equipments.off_hand.attributes.max_damage_bonus) : parseFloat(this.equipments.off_hand.max_damage);
	}else{
		delete this.left_weapon_tick;
		this.left_attack_speed = 0;
		this.left_min_damage = 0;
		this.left_max_damage = 0;
	}

	var strength, agility, intelligence, stamina, attack_speed_bonus, critical_rate, critical_damage;
	var health_regen, resource_regen, armor, life_steal, cooldown_reduction, movement_speed_bonus;
	strength = agility = intelligence = stamina = attack_speed_bonus = critical_rate = critical_damage = 0;
	health_regen = resource_regen = armor = life_steal = cooldown_reduction = movement_speed_bonus = 0;

	for(key in this.equipments){
		var item = this.equipments[key];
		if(item){
			strength += item.attributes.strength ? parseFloat(item.attributes.strength) : 0;
			agility += item.attributes.agility ? parseFloat(item.attributes.agility) : 0;
			intelligence += item.attributes.intelligence ? parseFloat(item.attributes.intelligence) : 0;
			stamina += item.attributes.stamina ? parseFloat(item.attributes.stamina) : 0;

			attack_speed_bonus += item.attributes.attack_speed_bonus ? parseFloat(item.attributes.attack_speed_bonus) : 0;
			critical_rate += item.attributes.critical_rate ? parseFloat(item.attributes.critical_rate) : 0;
			critical_damage += item.attributes.critical_damage ? parseFloat(item.attributes.critical_damage) : 0;

			health_regen += item.attributes.health_regen ? parseFloat(item.attributes.health_regen) : 0;
			resource_regen += item.attributes.resource_regen ? parseFloat(item.attributes.resource_regen) : 0;
			armor += item.armor ? item.armor : 0;
			armor += item.attributes.armor_bonus ? parseFloat(item.attributes.armor_bonus) : 0;
			life_steal += item.attributes.life_steal ? parseFloat(item.attributes.life_steal) : 0;

			cooldown_reduction += item.attributes.cooldown_reduce ? parseFloat(item.attributes.cooldown_reduce) : 0;
			movement_speed_bonus += item.attributes.movement_speed ? parseFloat(item.attributes.movement_speed) : 0;
		}
	}

	this.strength = this.char_strength * this.level + strength;
	this.agility = this.char_agility * this.level + agility;
	this.intelligence = this.char_intelligence * this.level + intelligence;
	this.stamina = this.char_stamina * this.level + stamina;

	var health_rate = this.health / this.max_health;
	this.max_health = this.stamina * 10 + this.strength * 5;
	this.health = health_rate * this.max_health;

	this.attack_speed_bonus = attack_speed_bonus;
	this.right_attack_speed *= (100 - this.attack_speed_bonus)/100;
	if(this.left_attack_speed){
		this.left_attack_speed *= (100 - this.attack_speed_bonus)/100;
	}

	this.critical_rate = critical_rate + (this.critical_magic ? 5 : 0);
	this.critical_damage = critical_damage;

	this.health_regen = (health_regen + this.stamina) * (this.last_defender ? 1.5 : 1);
	this.resource_regen = resource_regen;
	this.armor = armor;
	this.damage_reduction = armor / (armor + 100) + (this.endurance ? 0.1 : 0) + (this.last_defender ? 0.2 : 0);
	this.life_steal = life_steal;

	this.cooldown_reduction = cooldown_reduction;	
	this.movement_speed = (Math.round(this.char_movement_speed * (1 + (movement_speed_bonus + (this.swift_runner ? 15 : 0) )/100) * 10))/10;

	switch(this.primary_attribute){
		case "strength":
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.strength/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.strength/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.strength/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.strength/100)) : 0;
			break;
		case "agility":
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.agility/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.agility/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.agility/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.agility/100)) : 0;
			break;
		case "intelligence":
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.intelligence/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.intelligence/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.intelligence/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.intelligence/100)) : 0;
			break;
	}

	this.radius = this.char_radius = 12;
	this.dps = (this.right_min_damage + this.right_max_damage) / 2 * 60 / this.right_attack_speed * (1 - this.critical_rate / 100 + ((2+critical_damage/100) * this.critical_rate/100));
	if(this.equipments.off_hand && this.equipments.off_hand.type === "weapon"){
		this.dps += (this.left_min_damage + this.left_max_damage) / 2 * 60 / this.left_attack_speed * (1 - this.critical_rate / 100 + ((2+critical_damage/100) * this.critical_rate/100));
	}

	if(this.user.inventory.selectedCharacter === this){
		this.user.inventory.displayStats(this);
	}
}

EquippedUnit.prototype.equipItem = function(item){
	var part;
	if(this.level >= item.level || true){
		switch(item.part){
			case "weapon":
				switch(item.hand){
					case 1:
						if(this.equipments.main_hand && this.equipments.main_hand.hand === 2){
							this.user.inventory.addItem(this.equipments.main_hand);
							this.equipments.main_hand = item;
						}else if(!this.equipments.main_hand){
							this.equipments.main_hand = item;
						}else if(!this.equipments.off_hand && this.dual_wield){
							this.equipments.off_hand = item;
						}else if(this.equipments.main_hand){
							this.user.inventory.addItem(this.equipments.main_hand);
							this.equipments.main_hand = item;
						}
					break;
					case 2:
						if((item.name === "Wand" || item.name === "Staff") && !this.wand){
							this.user.inventory.addItem(item);
							this.speak("I can't equip staff or wand weapons", "info");
							return;
						}
						var count = 0;
						if(this.equipments.main_hand){	count++;	}
						if(this.equipments.off_hand){	count++;	}

						if(this.user.inventory.countEmptySpace() >= count){
							if(this.equipments.main_hand){	this.user.inventory.addItem(this.equipments.main_hand);	}
							if(this.equipments.off_hand){	this.user.inventory.addItem(this.equipments.off_hand);	}
							this.equipments.main_hand = item;
							this.equipments.off_hand = null;
						}else{
							this.user.inventory.addItem(item);
							this.speak("Not enough space", "info");
							//alert("Not enough space.");
							return;
						}
					break;
				}
			break;
			case "shield":
				if(this.defend){
					if(this.equipments.main_hand && this.equipments.main_hand.hand === 2){
						this.user.inventory.addItem(this.equipments.main_hand);
						this.equipments.main_hand = null;
						this.equipments.off_hand = item;
					}else if(this.equipments.off_hand){
						this.user.inventory.addItem(this.equipments.off_hand);
						this.equipments.off_hand = item;
					}else{
						this.equipments.off_hand = item;
					}
				}else{
					this.user.inventory.addItem(item);
					this.speak("I can't equip shields", "info");
					//alert("This unit can't equip shields");
					return;
				}
			break;
			case "ring":
				if(!this.equipments.right_ring){
					this.equipments.right_ring = item;
				}else if(!this.equipments.left_ring){
					this.equipments.left_ring = item;
				}else{
					this.user.inventory.addItem(this.equipments.right_ring);
					this.equipments.right_ring = item;
				}
			break
			default:
				if(this.equipments[item.part]){
					this.user.inventory.addItem(this.equipments[item.part]);
					this.equipments[item.part] = item;
				}else{
					this.equipments[item.part] = item;
				}
			break;
		}
		this.user.inventory.displayEquipItems(this);
		this.user.inventory.saveInventory();
		this.saveItems();
		this.updateStats();
	}else{
		this.user.inventory.addItem(item);
		this.user.inventory.displayEquipItems(this);
		this.user.inventory.saveInventory();
		this.saveItems();
		alert("Not enough unit level to equip this item");
	}
}

EquippedUnit.prototype.saveItems = function(){
	var items = [];

	for(key in this.equipments){
		var item = this.equipments[key];
		if(item){
			if(item.type === "weapon"){
				items.push({part:key, weapon:item._id});
			}else{
				items.push({part:key, armor:item._id});
			}
		}
	}

	$.post("saveunititem", {items:items, unit_id:this._id}, function(res){
		console.log(res);
	});
}

EquippedUnit.prototype.gainXP = function(exp){
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

EquippedUnit.prototype.levelUp = function(){
	this.level++;
	this.heal(this.max_health/10);

	this.updateStats();

	var levelup_text = new OutlineText("Level Up","bold 10px Arial","#E9A119","#000",2);
	levelup_text.x = -levelup_text.getMeasuredWidth()/2;
	this.addChild(levelup_text);
	createjs.Tween.get(levelup_text).to({y:-42},1000, createjs.Ease.cubicOut).wait(500).call(function(item){
		this.removeChild(levelup_text);
	},[],this);
}
