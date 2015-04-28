var ItemSchema = new Schema({
	primary_attribute:Number,
	part:String,
	name:String,
	type:String,
	rating:Number,
	level:Number,
	price:Number,
	repurchase:Boolean,
	icon:{
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	projectile:{
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	attributes:Schema.Types.Mixed,
});

ItemModel = mongoose.model('Item', ItemSchema);