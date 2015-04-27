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
	cropX:Number,
	cropY:Number,
	width:Number,
	height:Number,
	passive_skills:[{
		type:Schema.Types.ObjectId,
		ref:"PassiveSkill",
	}],
	active_skills:[{
		type:Schema.Types.ObjectId,
		ref:"ActiveSkill",
	}],
});

UnitSchema.methods.initHero = function(callback){
	var hero = this.toObject();
	hero.level = 1;
	hero.exp = 0;
	callback(hero);
}

UnitModel = mongoose.model('Unit', UnitSchema);