var PrototypeArmorSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	part:String,				// 0:head, 1:chest, 2:gloves, 3:boots, 4:belt, 5:cape, 6:ring, 7:necklace
	name:String,
	type:String,
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
}, { versionKey: false });

PrototypeArmorSchema.methods.setMerchantItem = function(level){
	var armor = this.toObject();
	armor._id = mongoose.Types.ObjectId();
	armor.level = level;
	armor.price = 0;
	armor.rating = Math.ceil(Math.random() * 3);

	switch(armor.part){
		case "shield":
			armor.armor = Math.ceil(4 * level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor.armor * 2 : armor.armor;
		break;
		case "head":
		case "chest":
			armor.armor = Math.ceil(2 * level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor.armor * 2 : armor.armor;
		break;
		case "gloves":
		case "boots":
		case "belt":
		case "cape":
			armor.armor = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
			armor.armor = armor.primary_attribute === 0 ? armor.armor * 2 : armor.armor;
		break;
		default:
			armor.armor = 0;
		break;
	}

	armor.attributes = []
	while(armor.attributes.length < armor.rating){
		var randomnumber = parseInt(Math.floor(Math.random() * 11));
		var found=false;
		for(var j = 0 ; j < armor.attributes.length ; j++){
			if(armor.attributes[j] === randomnumber){
				found=true;
				break;
			}
		}
		if(!found){
			armor.attributes[armor.attributes.length] = randomnumber;
		}
	}

	armor.attributes.sort(function(a, b){return a-b});
	armor.attributes.forEach(function(attribute){
		switch(attribute){
			case 0:
				armor.armor_bonus = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
				armor.price = armor.armor_bonus;
			break;
			case 1:
				var value = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
				armor.price += value;
				armor.primary_attribute = armor.primary_attribute === 3 ? Math.floor(Math.random() * 3) : armor.primary_attribute;
				switch(armor.primary_attribute){
					case 0:
						armor.strength = value;
					break;
					case 1:
						armor.agility = value;
					break;
					case 2:
						armor.intelligence = value;
					break;
				}
			break;
			case 2:
				armor.stamina = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
				armor.price += armor.stamina;
			break;
			case 3:
				armor.attack_speed_bonus = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += level * armor.attack_speed_bonus;
			break;
			case 4:
				armor.movement_speed = ((armor.rating - 1) * 2 + Math.ceil(Math.random() * 2)) * (armor.part === "boots"?2:1);
				armor.price += level * armor.movement_speed;
			break;
			case 5:
				armor.critical_rate = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += armor.critical_rate * level;
			break;
			case 6:
				armor.critical_damage = (armor.rating - 1) * 10 + Math.ceil(Math.random() * 10);
				armor.price += armor.critical_damage * level / 5;
			break;
			case 7:
				armor.life_steal = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
				armor.price += armor.life_steal * level;
			break;
			case 8:
				armor.cooldown_reduce = armor.rating;
				armor.price += 2 * level * armor.cooldown_reduce;
			break;
			case 9:
				armor.health_regen = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75) / 2);
				armor.price += armor.health_regen * 2;
			break;
			case 10:
				armor.resource_regen = Math.ceil((armor.rating) * (Math.random() / 4 + 0.75) / 2);
				armor.price += armor.resource_regen * 2 * level;
			break;
		}
	});
	armor.price = Math.ceil(armor.price);
	return armor;
}

PrototypeArmorModel = mongoose.model('PrototypeArmor', PrototypeArmorSchema);