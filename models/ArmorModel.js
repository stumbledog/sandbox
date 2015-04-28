var ArmorSchema = new Schema({
	primary_attribute:Number,	// 0:strength, 1:agility, 2:intelligence, 3:none
	part:String,				// 0:head, 1:chest, 2:gloves, 3:boots, 4:belt, 5:cape, 6:ring, 7:necklace
	name:String,
	type:String,
	armor:Number,
	price:Number,
	level:Number,
	rating:Number,
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
	attributes_index:[Number],
	attributes:Schema.Types.Mixed,
}, { versionKey: false });

ArmorModel = mongoose.model('Armor', ArmorSchema);