var WeaponSchema = new Schema({
	hand:Number,
	type:String,	// weapon
	attack_type:String,	// melee, range
	rating:Number,	// 1:common, 2:magic, 3:rare, 4:epic, 5:legendary
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
	attack_speed:Number,
	range:Number,
	min_damage_bonus:Number,
	max_damage_bonus:Number,
	attack_speed_bonus:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
});

WeaponSchema.pre('save', function(next){
	this.price = (min_damage + max_damage) / 2 / this.attack_speed * 100;
	next();
});

WeaponModel = mongoose.model('Weapon', WeaponSchema);