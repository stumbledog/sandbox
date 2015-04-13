function EquippedUnit(builder){
	this.equipped_unit_initialize(builder);
}

EquippedUnit.prototype = new Unit();
EquippedUnit.prototype.constructor = EquippedUnit;
EquippedUnit.prototype.unit_initialize = EquippedUnit.prototype.initialize;

EquippedUnit.prototype.equipped_unit_initialize = function(builder){
	this.unit_initialize(builder);

	this.character_class = builder.character_class;
	this.primary_attribute = parseInt(builder.primary_attribute);
	this.char_strength = parseInt(builder.strength);
	this.char_agility = parseInt(builder.agility);
	this.char_intelligence = parseInt(builder.intelligence);
	this.char_stamina = parseInt(builder.stamina);
	this.movement_speed = 1.5;

	this.level = builder.level;
	this.exp = builder.exp;
	this.resource_type = builder.resource_type;
	this.level_up_bonus = builder.level_up_bonus;

	this.max_health = this.health = 100;

	if(this.resource_type === "fury"){
		this.resource = 0;
	}else{
		this.resource = 100;
	}

	this.char_max_resource = 100;
	this.char_radius = 12;
	this.aggro_radius = 80;
	this.char_range = 16;
	this.char_right_attack_speed = 30;

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

	if(builder.items){
		this.initItems(builder.items);
	}

	this.updateStats();
}

EquippedUnit.prototype.initItems = function(builder_items){
	for(key in builder_items){
		var item = builder_items[key];
		if(item){
			switch(item.type){
				case "weapon":
					var weapon = new Weapon(item);
					weapon.bin = this;
					this.equipments[key] = weapon;
				break;
				case "armor":
					var armor = new Armor(item);
					armor.bin = this;
					this.equipments[key] = armor;
				break;
			}
		}
	}
	/*
	builder_items.forEach(function(item, index){
		if(item){
			switch(item.type){
				case "weapon":
					var weapon = new Weapon(item)
					weapon.bin = this;
					this.items[index] = weapon;
				break;
				case "armor":
					var armor = new Armor(item)
					armor.bin = this;
					this.items[index] = armor;
				break;
			}
		}
	}, this);*/
}

EquippedUnit.prototype.updateStats = function(){
	this.strength = this.char_strength;
	this.agility = this.char_agility;
	this.intelligence = this.char_intelligence;
	this.stamina = this.char_stamina;
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
		this.right_min_damage = this.equipments.main_hand.min_damage_bonus ? this.equipments.main_hand.min_damage + this.equipments.main_hand.min_damage_bonus : this.equipments.main_hand.min_damage;
		this.right_max_damage = this.equipments.main_hand.max_damage_bonus ? this.equipments.main_hand.max_damage + this.equipments.main_hand.max_damage_bonus : this.equipments.main_hand.max_damage;
		this.range = this.equipments.main_hand.range;		
	}else{
		this.right_weapon_tick = 0;
		this.right_attack_speed = 30;
		this.right_min_damage = 1;
		this.right_max_damage = 2;
		this.range = 16;		
	}

	if(this.equipments.off_hand && this.equipments.off_hand.type === "weapon"){
		this.left_weapon_tick = 0;
		this.left_attack_speed = this.equipments.off_hand.attack_speed;
		this.left_min_damage = this.equipments.off_hand.min_damage_bonus ? this.equipments.off_hand.min_damage + this.equipments.off_hand.min_damage_bonus : this.equipments.off_hand.min_damage;
		this.left_max_damage = this.equipments.off_hand.max_damage_bonus ? this.equipments.off_hand.max_damage + this.equipments.off_hand.max_damage_bonus : this.equipments.off_hand.max_damage;
	}else{
		delete this.left_weapon_tick;
		this.left_attack_speed = 0;
		this.left_min_damage = 0;
		this.left_max_damage = 0;
	}
/*
	if(this.items[9]){
		this.right_weapon_tick = 0;
		this.right_attack_speed = this.items[9].attack_speed;
		this.right_min_damage = this.items[9].min_damage_bonus ? this.items[9].min_damage + this.items[9].min_damage_bonus : this.items[9].min_damage;
		this.right_max_damage = this.items[9].max_damage_bonus ? this.items[9].max_damage + this.items[9].max_damage_bonus : this.items[9].max_damage;
		this.range = this.items[9].range;
	}else{
		this.right_weapon_tick = 0;
		this.right_attack_speed = 30;
		this.right_min_damage = 1;
		this.right_max_damage = 2;
		this.range = 16;
	}

	if(this.items[10]){
		this.left_weapon_tick = 0;
		this.left_attack_speed = this.items[10].attack_speed;
		this.left_min_damage = this.items[10].min_damage_bonus ? this.items[10].min_damage + this.items[10].min_damage_bonus : this.items[10].min_damage;
		this.left_max_damage = this.items[10].max_damage_bonus ? this.items[10].max_damage + this.items[10].max_damage_bonus : this.items[10].max_damage;
	}else{
		delete this.left_weapon_tick;
		this.left_attack_speed = 0;
		this.left_min_damage = 0;
		this.left_max_damage = 0;
	}
*/
	var strength = 0;
	var agility = 0;
	var intelligence = 0;
	var stamina = 0;

	var attack_speed_bonus = 0;
	var critical_rate = 0;
	var critical_damage = 0;

	var health_regen = 0;
	var resource_regen = 0;
	var armor = 0;
	var life_steal = 0;

	var cooldown_reduction = 0;
	var movement_speed_bonus = 0;

	for(key in this.equipments){
		var item = this.equipments[key];
		if(item){
			strength += item.strength ? item.strength : 0;
			agility += item.agility ? item.agility : 0;
			intelligence += item.intelligence ? item.intelligence : 0;
			stamina += item.stamina ? item.stamina : 0;

			attack_speed_bonus += item.attack_speed_bonus ? item.attack_speed_bonus : 0;
			critical_rate += item.critical_rate ? item.critical_rate : 0;
			critical_damage += item.critical_damage ? item.critical_damage : 0;

			health_regen += item.health_regen ? item.health_regen : 0;
			resource_regen += item.resource_regen ? item.resource_regen : 0;
			armor += item.armor ? item.armor : 0;
			armor += item.armor_bonus ? item.armor_bonus : 0;
			life_steal += item.life_steal ? item.life_steal : 0;

			cooldown_reduction += item.cooldown_reduce ? item.cooldown_reduce : 0;
			movement_speed_bonus += item.movement_speed ? item.movement_speed : 0;
		}
	}
/*
	this.items.forEach(function(item, index){
		strength += item.strength ? item.strength : 0;
		agility += item.agility ? item.agility : 0;
		intelligence += item.intelligence ? item.intelligence : 0;
		stamina += item.stamina ? item.stamina : 0;

		attack_speed_bonus += item.attack_speed_bonus ? item.attack_speed_bonus : 0;
		critical_rate += item.critical_rate ? item.critical_rate : 0;
		critical_damage += item.critical_damage ? item.critical_damage : 0;

		health_regen += item.health_regen ? item.health_regen : 0;
		resource_regen += item.resource_regen ? item.resource_regen : 0;
		armor += item.armor ? item.armor : 0;
		armor += item.armor_bonus ? item.armor_bonus : 0;
		life_steal += item.life_steal ? item.life_steal : 0;

		cooldown_reduction += item.cooldown_reduce ? item.cooldown_reduce : 0;
		movement_speed_bonus += item.movement_speed ? item.movement_speed : 0;
	});
*/
	this.strength = this.char_strength + strength;
	this.agility = this.char_agility + agility;
	this.intelligence = this.char_intelligence + intelligence;
	this.stamina = this.char_stamina + stamina;

	var health_rate = this.health/this.max_health; 
	this.max_health = this.stamina * 10 + this.strength * 5;
	this.health = health_rate * this.max_health;
	this.max_resource = this.resource = 100;

	this.attack_speed_bonus = attack_speed_bonus;
	this.right_attack_speed *= (100 - this.attack_speed_bonus)/100;
	if(this.left_attack_speed){
		this.left_attack_speed *= (100 - this.attack_speed_bonus)/100;
	}

	this.critical_rate = critical_rate;
	this.critical_damage = 100 + critical_damage;

	this.health_regen = health_regen;
	this.resource_regen = resource_regen;
	this.armor = armor;
	this.life_steal = life_steal;

	this.cooldown_reduction = cooldown_reduction;
	this.movement_speed = (Math.round(this.movement_speed * (1 + movement_speed_bonus/100) * 10))/10;

	switch(this.primary_attribute){
		case 0:
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.strength/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.strength/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.strength/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.strength/100)) : 0;
		break;
		case 1:
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.agility/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.agility/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.agility/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.agility/100)) : 0;
		break;
		case 2:
			this.right_min_damage = Math.round(this.right_min_damage * (1 + this.intelligence/100));
			this.right_max_damage = Math.round(this.right_max_damage * (1 + this.intelligence/100));
			this.left_min_damage = this.left_min_damage ? Math.round(this.left_min_damage * (1 + this.intelligence/100)) : 0;
			this.left_max_damage = this.left_max_damage ? Math.round(this.left_max_damage * (1 + this.intelligence/100)) : 0;
		break;
	}

	this.radius = this.char_radius = 12;
	this.dps = (this.right_min_damage + this.right_max_damage) / 2 * 30 / this.right_attack_speed * (1 - this.critical_rate / 100 + ((2+critical_damage/100) * this.critical_rate/100));
	if(this.equipments.off_hand && this.equipments.off_hand.type === "weapon"){
		this.dps += (this.left_min_damage + this.left_max_damage) / 2 * 30 / this.left_attack_speed * (1 - this.critical_rate / 100 + ((2+critical_damage/100) * this.critical_rate/100));
	}
}

EquippedUnit.prototype.equipItem = function(item){
	// 0:head, 1:chest, 2:gloves, 3:boots, 4:belt, 5:cape, 6:necklace, 7:right ring, 8:left ring, 9:right weapon, 10:left weapon
	switch(item.part){
		case "weapon":
			switch(item.hand){
				case 1:
					if(this.equipments.main_hand && this.equipments.main_hand.hand === 2){
						this.user.inventory.addItem(this.equipments.main_hand);
						this.equipments.main_hand = item;
					}else if(!this.equipments.main_hand){
						this.equipments.main_hand = item;
					}else if(!this.equipments.off_hand){
						this.equipments.off_hand = item;
					}else if(this.equipments.main_hand){
						this.user.inventory.addItem(this.equipments.main_hand);
						this.equipments.main_hand = item;
					}
				break;
				case 2:
					var count = 0;
					if(this.equipments.main_hand){	count++;	}
					if(this.equipments.off_hand){	count++;	}

					if(this.user.inventory.countEmptySpace() >= count){
						if(this.equipments.main_hand){	this.user.inventory.addItem(this.equipments.main_hand);	}
						if(this.equipments.off_hand){	this.user.inventory.addItem(this.equipments.off_hand);	}
						this.equipments.main_hand = item;
						this.equipments.off_hand = null;
					}else{
						alert("Not enough space.");
					}
				break;
			}
		break;
		case "shield":
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
	/*
	switch(item.constructor.name){
		case "Weapon":
			switch(item.hand){
				case 1:
					if(this.items[9] && this.items[9].hand === 2){
						this.user.inventory.addItem(this.items[9]);
						this.items[9] = item;
					}else if(!this.items[9]){
						this.items[9] = item;
					}else if(!this.items[10]){
						this.items[10] = item;
					}else{
						this.user.inventory.addItem(this.items[9]);
						this.items[9] = item;
					}
				break;
				case 2:
					if(this.items[9]){
						this.user.inventory.addItem(this.items[9]);
					}
					if(this.items[10]){
						this.user.inventory.addItem(this.items[10]);
					}
					this.items[9] = item;
					delete this.items[10];
				break;
			}
		break;
		case "Armor":
			switch(item.part){
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 6:
					if(this.items[item.part]){
						this.user.inventory.addItem(this.items[item.part]);
					}
					this.items[item.part] = item;
				break;
				case 7:
					if(!this.items[item.part]){
						this.items[item.part] = item;
					}else if(!this.items[item.part + 1]){
						this.items[item.part + 1] = item;
					}else{
						this.user.inventory.addItem(this.items[item.part]);
						this.items[item.part] = item;
					}
				break;
			}
		break;
	}
	*/
	this.user.inventory.displayEquipItems(this);
	this.user.saveEquipItems();
	this.updateStats();
}
