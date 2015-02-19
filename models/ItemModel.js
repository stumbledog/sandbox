var ItemSchema = new Schema({
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
});

mongoose.model('Item', ItemSchema);