var PrototypeWeaponSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	hand:Number,
	type:String,	// weapon
	attack_type:String,	// melee, range
	name:String,
	sprite:{
		source:String,
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	icon:{
		source:String,
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	min_damage:Number,
	max_damage:Number,
	attack_speed:Number,
	range:Number,
}, { versionKey: false });
PrototypeWeaponSchema.methods.setMerchantItem = function(level){
	var weapon = this.toObject();
	weapon.level = level;
	weapon.price = 0;
	weapon.min_damage *= level;
	weapon.max_damage *= level;
	weapon.rating = Math.ceil(Math.random() * 3);

	weapon.attributes = []
	while(weapon.attributes.length < weapon.rating){
		var randomnumber = Math.floor(Math.random() * 6)
		var found=false;
		for(var j = 0 ; j < weapon.attributes.length ; j++){
			if(weapon.attributes[j] === randomnumber){
				found=true;
				break;
			}
		}
		if(!found){
			weapon.attributes[weapon.attributes.length] = randomnumber;
		}
	}
	weapon.attributes.sort();
	weapon.attributes.forEach(function(attribute){
		switch(attribute){
			case 0:
				weapon.min_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.5))*10)/10;
				weapon.max_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.75))*10)/10;
				weapon.price += (weapon.min_damage_bonus + weapon.max_damage_bonus) * 2;
			break;
			case 1:
				var value = Math.ceil(level * (weapon.rating) * (Math.random() / 4 + 0.75));
				weapon.price += value;
				weapon.primary_attribute = weapon.primary_attribute === 3 ? Math.floor(Math.random() * 3) : weapon.primary_attribute;
				switch(weapon.primary_attribute){
					case 0:
						weapon.strength = value;
					break;
					case 1:
						weapon.agility = value;
					break;
					case 2:
						weapon.intelligence = value;
					break;
				}
			break;
			case 2:
				weapon.attack_speed_bonus = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.price += level * weapon.attack_speed_bonus;
			break;
			case 3:
				weapon.critical_rate = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.price += weapon.critical_rate * level;
			break;
			case 4:
				weapon.critical_damage = (weapon.rating - 1) * 10 + Math.ceil(Math.random() * 10);
				weapon.price += weapon.critical_damage * level / 5;
			break;
			case 5:
				weapon.life_steal = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.price += weapon.life_steal * level;
			break;
		}
	});
	weapon.price = Math.ceil(weapon.price);
	return weapon;
}

PrototypeWeaponSchema.methods.generateMerchantItem = function(level, qty, callback){
	var weapons = []
	this.model('PrototypeWeapon').find({}, function(err, prototype_weapons){
		for(var i = 0 ; i < qty ; i++){
			var weapon = prototype_weapons[Math.floor(Math.random() * prototype_weapons.length)].toObject();
			weapon.level = level;
			weapon.price = 0;
			weapon.min_damage *= level;
			weapon.max_damage *= level;
			weapon.rating = Math.ceil(Math.random() * 3);

			weapon.attributes = []
			while(weapon.attributes.length < weapon.rating){
				var randomnumber = Math.floor(Math.random() * 6)
				var found=false;
				for(var j = 0 ; j < weapon.attributes.length ; j++){
					if(weapon.attributes[j] === randomnumber){
						found=true;
						break;
					}
				}
				if(!found){
					weapon.attributes[weapon.attributes.length] = randomnumber;
				}
			}
			weapon.attributes.sort();
			weapon.attributes.forEach(function(attribute){
				switch(attribute){
					case 0:
						weapon.min_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.5))*10)/10;
						weapon.max_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.75))*10)/10;
						weapon.price += (weapon.min_damage_bonus + weapon.max_damage_bonus) * 2;
					break;
					case 1:
						var value = Math.ceil(level * (weapon.rating) * (Math.random() / 4 + 0.75));
						weapon.price += value;
						weapon.primary_attribute = weapon.primary_attribute === 3 ? Math.floor(Math.random() * 3) : weapon.primary_attribute;
						switch(weapon.primary_attribute){
							case 0:
								weapon.strength = value;
							break;
							case 1:
								weapon.agility = value;
							break;
							case 2:
								weapon.intelligence = value;
							break;
						}
					break;
					case 2:
						weapon.attack_speed_bonus = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
						weapon.price += level * weapon.attack_speed_bonus;
					break;
					case 3:
						weapon.critical_rate = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
						weapon.price += weapon.critical_rate * level;
					break;
					case 4:
						weapon.critical_damage = (weapon.rating - 1) * 10 + Math.ceil(Math.random() * 10);
						weapon.price += weapon.critical_damage * level / 5;
					break;
					case 5:
						weapon.life_steal = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
						weapon.price += weapon.life_steal * level;
					break;
				}
			});
			weapon.price = Math.ceil(weapon.price);
			weapons.push(weapon);
		}
		callback(err, weapons);
	});
}

PrototypeWeaponModel = mongoose.model('PrototypeWeapon', PrototypeWeaponSchema);