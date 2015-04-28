var UnitSchema = new Schema({
	name:String,
	type:String,
	primary_attribute:String,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	resource_type:String,
	sprite:String,
	portrait:String,
	index:Number,
	passive_skills:[{
		type:Schema.Types.ObjectId,
		ref:"PassiveSkill",
	}],
	active_skills:[{
		type:Schema.Types.ObjectId,
		ref:"ActiveSkill",
	}],
});

UnitModel = mongoose.model('Unit', UnitSchema);