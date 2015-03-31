var NPCSchema = new Schema({
	name:String,
	sprite:String,
	index:Number,
	type:String,
});

var MonsterSchema = new Schema({

});

var MapSchema = new Schema({
	maps:[{
		tiles:[Schema.Types.Mixed],
		tile_map:[Schema.Types.Mixed],
		src:String, 
		block:Boolean,
	}],
	monsters:[MonsterSchema],
	npcs:[NPCSchema],
	/*
	monsters:[{
		attribute:{type:Number, ref:"Monster"},
		position:{
			x:Number,
			y:Number,
		}
	}],
	npcs:[{
		attribute:{type:Number, ref:"NPC"},
		position:{
			x:Number,
			y:Number,
		}
	}],*/
	act:Number,
	chapter:Number,
	merchant:Boolean,
	recruiter:Boolean,
	width:Number,
	height:Number,
	cols:Number,
	rows:Number,
	merchantable_items:Schema.Types.Mixed,
	recruitable_units:Schema.Types.Mixed,
	start_point:[Number]
});

MapModel = mongoose.model('Map', MapSchema);