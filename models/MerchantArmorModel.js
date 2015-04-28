var MerchantArmorSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	part:String,				// 0:head, 1:chest, 2:gloves, 3:boots, 4:belt, 5:cape, 6:ring, 7:necklace
	name:String,
	type:String,
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
}, { versionKey: false });

MerchantArmorSchema.methods.setMerchantItem = function(level, rating){
	var armor = this.toObject();
	armor._id = mongoose.Types.ObjectId();
	armor.level = level;
	armor.price = 0;
	armor.rating = (typeof rating === "undefined") ? (Math.ceil(Math.random() * 3)) : rating;
	armor.attributes = {};

	switch(armor.part){
		case "shield":
			var armor_value = Math.ceil(4 * level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor_value * 2 : armor_value;
		break;
		case "head":
		case "chest":
			var armor_value = Math.ceil(2 * level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor_value * 2 : armor_value;
		break;
		case "gloves":
		case "boots":
		case "belt":
		case "cape":
			var armor_value = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor_value * 2 : armor_value;
		break;
		default:
			armor.armor = 0;
		break;
	}

	armor.attributes_index = []
	while(armor.attributes_index.length < armor.rating){
		var randomnumber = parseInt(Math.floor(Math.random() * 11));
		var found=false;
		for(var j = 0 ; j < armor.attributes_index.length ; j++){
			if(armor.attributes_index[j] === randomnumber){
				found=true;
				break;
			}
		}
		if(!found){
			armor.attributes_index[armor.attributes_index.length] = randomnumber;
		}
	}

	armor.attributes_index.sort(function(a, b){return a-b});
	armor.attributes_index.forEach(function(attribute){
		switch(attribute){
			case 0:
				armor.attributes.armor_bonus = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
				armor.price = armor.attributes.armor_bonus;
			break;
			case 1:
				var value = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
				armor.price += value;
				armor.primary_attribute = armor.primary_attribute === 3 ? Math.floor(Math.random() * 3) : armor.primary_attribute;
				switch(armor.primary_attribute){
					case 0:
						armor.attributes.strength = value;
					break;
					case 1:
						armor.attributes.agility = value;
					break;
					case 2:
						armor.attributes.intelligence = value;
					break;
				}
			break;
			case 2:
				armor.attributes.stamina = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
				armor.price += armor.attributes.stamina;
			break;
			case 3:
				armor.attributes.attack_speed_bonus = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += level * armor.attributes.attack_speed_bonus;
			break;
			case 4:
				armor.attributes.movement_speed = ((armor.rating - 1) * 2 + Math.ceil(Math.random() * 2)) * (armor.part === "boots"?2:1);
				armor.price += level * armor.attributes.movement_speed;
			break;
			case 5:
				armor.attributes.critical_rate = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += armor.attributes.critical_rate * level;
			break;
			case 6:
				armor.attributes.critical_damage = (armor.rating - 1) * 10 + Math.ceil(Math.random() * 10);
				armor.price += armor.attributes.critical_damage * level / 5;
			break;
			case 7:
				armor.attributes.life_steal = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += armor.attributes.life_steal * level;
			break;
			case 8:
				armor.attributes.cooldown_reduce = armor.rating;
				armor.price += 2 * level * armor.attributes.cooldown_reduce;
			break;
			case 9:
				armor.attributes.health_regen = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75) / 2);
				armor.price += armor.attributes.health_regen * 2;
			break;
			case 10:
				armor.attributes.resource_regen = Math.ceil((armor.rating) * (Math.random() / 4 + 0.75) / 2);
				armor.price += armor.attributes.resource_regen * 2 * level;
			break;
		}
	});
	armor.price = Math.ceil(armor.price);
	return armor;
}

MerchantArmorModel = mongoose.model('MerchantArmor', MerchantArmorSchema);