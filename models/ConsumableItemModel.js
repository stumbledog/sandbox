var ConsumableItemSchema = new Schema({
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
	qty:Number,
	health:Number,
	resource:Number,
});

ConsumableItemModel = mongoose.model('ConsumableItem', ConsumableItemSchema);