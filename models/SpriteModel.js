var SpriteSchema = new Schema({
	sprite:String,
	portrait:String,
	cropX:Number,
	cropY:Number,
	width:Number,
	height:Number,
});

SpriteModel = mongoose.model('Sprite', SpriteSchema);