var WeaponSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	part:{type:String, default:"weapon"},
	hand:Number,
	type:String,	// weapon
	attack_type:String,	// melee, range
	name:String,
	min_damage:Number,
	max_damage:Number,
	attack_speed:Number,
	range:Number,
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
	projectile:{
		source:String,
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
		spin:Number,
	},
}, { versionKey: false });

WeaponSchema.methods.setMerchantItem = function(level, rating){
	var weapon = this.toObject();
	weapon._id = mongoose.Types.ObjectId();
	weapon.level = level;
	weapon.price = 0;
	weapon.min_damage *= level;
	weapon.max_damage *= level;
	weapon.rating = (typeof rating === "undefined") ? (Math.ceil(Math.random() * 3)) : rating;

	weapon.attributes = []
	while(weapon.attributes.length < weapon.rating){
		var randomnumber = parseInt(Math.floor(Math.random() * 6));
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
	weapon.attributes.sort(function(a, b){return a-b});
	weapon.attributes.forEach(function(attribute){
		switch(attribute){
			case 0:
				weapon.min_damage_bonus = (0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.5);
				weapon.max_damage_bonus = (0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.75);
				weapon.min_damage_bonus *= (weapon.hand === 2 ? 1.5 : 1) * weapon.attack_speed / 60;
				weapon.max_damage_bonus *= (weapon.hand === 2 ? 1.5 : 1) * weapon.attack_speed / 60;
				weapon.min_damage_bonus = Math.round(weapon.min_damage_bonus * 10) / 10;
				weapon.max_damage_bonus = Math.round(weapon.max_damage_bonus * 10) / 10;
				weapon.price += (weapon.min_damage_bonus + weapon.max_damage_bonus) * 2;
			break;
			case 1:
				var value = Math.ceil(level * (weapon.rating) * (Math.random() / 4 + 0.75));
				value *= weapon.hand === 2 ? 1.5 : 1;
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
				weapon.critical_rate *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.critical_rate * level;
			break;
			case 4:
				weapon.critical_damage = (weapon.rating - 1) * 10 + Math.ceil(Math.random() * 10);
				weapon.critical_damage *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.critical_damage * level / 5;
			break;
			case 5:
				weapon.life_steal = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.life_steal *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.life_steal * level;
			break;
		}
	});
	weapon.price = Math.ceil(weapon.price);
	return weapon;
}

WeaponModel = mongoose.model('Weapon', WeaponSchema);