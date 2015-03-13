var PrototypeConsumableItemSchema = new Schema({
	name:String,
	type:String,
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
});

PrototypeConsumableItemModel = mongoose.model('PrototypeConsumableItem', PrototypeConsumableItemSchema);