var PrototypeWeaponSchema = new Schema({
	_id:Number,
	level:Number,
	hand:String,	// 1-hand, 2-hand
	type:String,	// melee, range
	rating:String,	// common, magic, rare, epic, legendary
	name:String,
	merchantable:Boolean,
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
	movement_speed:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
	armor:Number,
});

PrototypeWeaponModel = mongoose.model('PrototypeWeapon', PrototypeWeaponSchema);