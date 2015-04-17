var RecrutableUnitSchema = new Schema({
	character_class:String,
	primary_attribute:Number,
	level:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	sprite:String,
	price:Number,
	portrait:String,
	index:Number,
	resource_type:String,
	level_up_bonus:{
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
	},
	passive_skills:Schema.Types.Mixed,
	active_skills:Schema.Types.Mixed,
});

var NPCSchema = new Schema({
	name:String,
	sprite:String,
	index:Number,
	type:String,
	x:Number,
	y:Number,
	recruitable_units:[RecrutableUnitSchema],
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