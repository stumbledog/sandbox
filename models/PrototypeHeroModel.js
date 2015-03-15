var HeroSchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});

HeroModel = mongoose.model('Hero', HeroSchema);