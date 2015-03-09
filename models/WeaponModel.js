var WeaponSchema = new Schema({
	hand:String,	// 1-hand, 2-hand
	type:String,	// weapon
	attack_type:String,	// melee, range
	rating:String,	// common, magic, rare, epic, legendary
	name:String,
	price:Number,
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
	range:Number,
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

WeaponSchema.pre('save', function(next){
	this.price = (min_damage + max_damage) / 2 / this.attack_speed * 100;
	next();
});

WeaponModel = mongoose.model('Weapon', WeaponSchema);