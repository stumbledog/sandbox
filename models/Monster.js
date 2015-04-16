var MonsterSchema = new Schema({
	name:String,
	sprite:String,
	index:Number,
	regY:Number,
	radius:Number,
	type:String,
	health:Number,
	damage:Number,
	range:Number,
	attack_speed:Number,
	movement_speed:Number,
	gold:Number,
	xp:Number,
	skills:Schema.Types.Mixed,
}, { versionKey: false });

MonsterModel = mongoose.model('Monster', MonsterSchema);