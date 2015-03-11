var PrototypeWeaponSchema = new Schema({
	_id:Number,
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
});

PrototypeWeaponModel = mongoose.model('PrototypeWeapon', PrototypeWeaponSchema);