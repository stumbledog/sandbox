var HeroSchema = new Schema({
	name:String,
	primary_attribute:String,
	strength:Number,
	dexterity:Number,
	intelligence:Number,
	vitality:Number,
	sprite:String,
	portrait:String,
	index:Number,
	rate:Number,
	level:Number,
	exp:Number,
	resource_type:String,
	_user:{type:Schema.Types.ObjectId, ref:'User'},
	_items:[{type:Schema.Types.ObjectId, ref:'Item'}],
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});



HeroModel = mongoose.model('Hero', HeroSchema);