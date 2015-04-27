var ItemSchema = new Schema({
	part:String,
	name:String,
	type:String,
	rating:Number,
	level:Number,
	price:Number,
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
	projectile:{

	},
	attributes:Schema.Types.Mixed,
});

ItemModel = mongoose.model('Item', ItemSchema);