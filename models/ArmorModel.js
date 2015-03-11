var ArmorSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	part:Number,				// 0:head, 1:chest, 2:gloves, 3:boots, 4:belt, 5:cape, 6:shield, 7:ring, 8:necklace
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
	armor:Number,
	armor_bonus:Number,
	attack_speed:Number,
	movement_speed:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
	cooldown_reduce:Number,
	health_regen:Number,
	resource_regen:Number,
});

ArmorModel = mongoose.model('Armor', ArmorSchema);