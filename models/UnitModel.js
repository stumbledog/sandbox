var UnitSchema = new Schema({
	src:String,
	src_id:String,
	portrait_src:String,
	portrait_id:String,
	index:Number,
	level:Number,
	exp:Number,
	resource_type:String,
	resource:Number,
	max_resource:Number,
	health:Number,
	damage:Number,
	attack_speed:Number,
	armor:Number,
	movement_speed:Number,
	critical_rate:Number,
	critical_damage:Number,
	radius:Number,
	aggro_radius:Number,
	range:Number,
	type:String,
	team:String,
	health_color:String,
	damage_color:String,
	_weapon:{
		type:Schema.Types.ObjectId,
		ref:'Weapon'
	},
	_skills:[{
		type:Schema.Types.ObjectId,
		ref:'Skill'
	}]
});

mongoose.model('Unit', UnitSchema);