var NPCSchema = new Schema({
	name:String,
	model:{
		sprite:String,
		index:Number,
	},
	type:String,
	x:Number,
	y:Number,
});

var MapSchema = new Schema({
	maps:[{
		tiles:Schema.Types.Mixed,
		tile_map:Schema.Types.Mixed,
		src:String,
		block:Boolean,
	}],
	neutral_territory:Boolean,
	monsters:Schema.Types.Mixed,
	npcs:[NPCSchema],
	act:Number,
	chapter:Number,
	name:String,
	merchant:Boolean,
	recruiter:Boolean,
	width:Number,
	height:Number,
	cols:Number,
	rows:Number,
	merchantable_items:Schema.Types.Mixed,
	start_point:[Number],
	world_map:Schema.Types.Mixed
});

MapModel = mongoose.model('Map', MapSchema);