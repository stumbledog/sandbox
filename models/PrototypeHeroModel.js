var HeroSchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});

HeroSchema.methods.initHero = function(){
	var hero = this.toObject();
	hero.level = 1;
	hero.exp = 0;

	switch(this.primary_attribute){
		case "strength":

		break;
		case "agility":
		break;

		case "intelligence":

		break;
	}
	
}

HeroModel = mongoose.model('Hero', HeroSchema);