var PrototypeUnitSchema = new Schema({
	_id:Number,
	src:String,
	portrait_src:String,
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
	regX:Number,
	regY:Number,
	_items:[{
		type:Schema.Types.ObjectId,
		ref:'Item'
	}],
	_skills:[{
		type:Schema.Types.ObjectId,
		ref:'Skill'
	}]
});

PrototypeUnitModel = mongoose.model('PrototypeUnit', PrototypeUnitSchema);