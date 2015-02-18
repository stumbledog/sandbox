var MapSchema = new Schema({
	maps:[{
		tiles:[Schema.Types.Mixed],
		tile_map:[Schema.Types.Mixed],
		src:String, 
		index:String,
		block:Boolean,
	}],
	width:Number,
	height:Number,
	cols:Number,
	rows:Number,
	start_point:[Number]
});

mongoose.model('Map', MapSchema);