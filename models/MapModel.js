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
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}],
	level_up_bonus:{
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
	}
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

var MonsterSchema = new Schema({

});

var MapSchema = new Schema({
	maps:[{
		tiles:Schema.Types.Mixed,
		tile_map:Schema.Types.Mixed,
		src:String,
		block:Boolean,
	}],
	neutral_territory:Boolean,
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