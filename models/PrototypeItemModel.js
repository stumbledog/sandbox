var PrototypeItemSchema = new Schema({
	_id:Number,
	type:String,
	rating:String,
	src:String,
	icon:String,
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

PrototypeItemModel = mongoose.model('PrototypeItem', PrototypeItemSchema);