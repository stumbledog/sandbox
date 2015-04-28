var MerchantWeaponSchema = new Schema({
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

MerchantWeaponSchema.methods.setMerchantItem = function(level, rating){
	var weapon = this.toObject();
	weapon._id = mongoose.Types.ObjectId();
	weapon.level = level;
	weapon.price = 0;
	weapon.min_damage *= level;
	weapon.max_damage *= level;
	weapon.rating = (typeof rating === "undefined") ? (Math.ceil(Math.random() * 3)) : rating;
	weapon.attributes = {};
	
	weapon.attributes_index = []
	while(weapon.attributes_index.length < weapon.rating){
		var randomnumber = parseInt(Math.floor(Math.random() * 6));
		var found=false;
		for(var j = 0 ; j < weapon.attributes_index.length ; j++){
			if(weapon.attributes_index[j] === randomnumber){
				found=true;
				break;
			}
		}
		if(!found){
			weapon.attributes_index[weapon.attributes_index.length] = randomnumber;
		}
	}
	weapon.attributes_index.sort(function(a, b){return a-b});
	weapon.attributes_index.forEach(function(attribute){
		switch(attribute){
			case 0:
				weapon.attributes.min_damage_bonus = (0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.5);
				weapon.attributes.max_damage_bonus = (0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.75);
				weapon.attributes.min_damage_bonus *= (weapon.hand === 2 ? 1.5 : 1) * weapon.attack_speed / 60;
				weapon.attributes.max_damage_bonus *= (weapon.hand === 2 ? 1.5 : 1) * weapon.attack_speed / 60;
				weapon.attributes.min_damage_bonus = Math.round(weapon.attributes.min_damage_bonus * 10) / 10;
				weapon.attributes.max_damage_bonus = Math.round(weapon.attributes.max_damage_bonus * 10) / 10;
				weapon.price += (weapon.min_damage_bonus + weapon.max_damage_bonus) * 2;
			break;
			case 1:
				var value = Math.ceil(level * (weapon.rating) * (Math.random() / 4 + 0.75));
				value *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += value;
				weapon.primary_attribute = weapon.primary_attribute === 3 ? Math.floor(Math.random() * 3) : weapon.primary_attribute;
				switch(weapon.primary_attribute){
					case 0:
						weapon.attributes.strength = value;
					break;
					case 1:
						weapon.attributes.agility = value;
					break;
					case 2:
						weapon.attributes.intelligence = value;
					break;
				}
			break;
			case 2:
				weapon.attributes.attack_speed_bonus = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.price += level * weapon.attributes.attack_speed_bonus;
			break;
			case 3:
				weapon.attributes.critical_rate = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.attributes.critical_rate *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.attributes.critical_rate * level;
			break;
			case 4:
				weapon.attributes.critical_damage = (weapon.rating - 1) * 10 + Math.ceil(Math.random() * 10);
				weapon.attributes.critical_damage *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.attributes.critical_damage * level / 5;
			break;
			case 5:
				weapon.attributes.life_steal = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				weapon.attributes.life_steal *= weapon.hand === 2 ? 1.5 : 1;
				weapon.price += weapon.attributes.life_steal * level;
			break;
		}
	});
	weapon.price = Math.ceil(weapon.price);
	return weapon;
}

MerchantWeaponModel = mongoose.model('MerchantWeapon', MerchantWeaponSchema);