var PrototypeWeaponSchema = new Schema({
	_id:Number,
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
	/*
	min_damage_bonus:Number,
	max_damage_bonus:Number,
	attack_speed_bonus:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
	*/
});

PrototypeWeaponModel = mongoose.model('PrototypeWeapon', PrototypeWeaponSchema);