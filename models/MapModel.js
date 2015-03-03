var MapSchema = new Schema({
	maps:[{
		tiles:[Schema.Types.Mixed],
		tile_map:[Schema.Types.Mixed],
		src:String, 
		block:Boolean,
	}],
	monsters:[{
		_monster:{type:Number, ref:"Monster"},
		position:{
			x:Number,
			y:Number,
		}
	}],
	npcs:[{
		_npc:{type:Number, ref:"NPC"},
		position:{
			x:Number,
			y:Number,
		}
	}],
	act:Number,
	chapter:Number,
	merchant:Boolean,
	recruiter:Boolean,
	width:Number,
	height:Number,
	cols:Number,
	rows:Number,
	merchartable_items:Schema.Types.Mixed,
	recruitable_units:Schema.Types.Mixed,
	start_point:[Number]
});

MapModel = mongoose.model('Map', MapSchema);