var MapSchema = new Schema({
	maps:[{
		tiles:[Schema.Types.Mixed],
		tile_map:[Schema.Types.Mixed],
		src:String, 
		block:Boolean,
	}],
	units:[{
		prototype_unit:{type:Number, ref:"PrototypeUnit"},
		position:{
			x:Number,
			y:Number,
		}
	}],
	act:Number,
	chapter:Number,
	width:Number,
	height:Number,
	cols:Number,
	rows:Number,
	start_point:[Number]
});

MapModel = mongoose.model('Map', MapSchema);