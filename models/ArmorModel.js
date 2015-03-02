var ArmorSchema = new Schema({
	part:String,	// head, chest, gloves, boots, belt, pants, shoulders, ring, necklace
	rating:String,	// common, magic, rare, epic, legendary
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

ArmorModel = mongoose.model('Armor', ArmorSchema);