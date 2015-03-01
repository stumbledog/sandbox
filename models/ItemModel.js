var ItemSchema = new Schema({
	name:String,
	type:String,
	src:String,
	src_id:String,
	cropX:Number,
	cropY:Number,
	width:Number,
	height:Number,
	regX:Number,
	regY:Number,
	scale:Number,
	stats:{
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
		damage:Number,
		attack_speed:Number,
		movement_speed:Number,
		critical_rate:Number,
		critical_damage:Number,
	}
});

ItemModel = mongoose.model('Item', ItemSchema);