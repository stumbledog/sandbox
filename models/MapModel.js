var RecrutableUnitSchema = new Schema({
	name:String,
	character_class:String,
	primary_attribute:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	sprite:String,
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
	//recruitable_units:[RecrutableUnitSchema],
	start_point:[Number]
});

MapModel = mongoose.model('Map', MapSchema);