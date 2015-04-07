var PrototypeHeroSchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});

PrototypeHeroSchema.methods.initHero = function(callback){
	var hero = this.toObject();
	hero.level = 1;
	hero.exp = 0;
	hero.stamina = 2;
	hero.items = [];
	switch(this.primary_attribute){
		case "strength":
			hero.strength = 2;
			hero.agility = 1;
			hero.intelligence = 1;
		break;
		case "agility":
			hero.strength = 1;
			hero.agility = 2;
			hero.intelligence = 1;
		break;
		case "intelligence":
			hero.strength = 1;
			hero.agility = 1;
			hero.intelligence = 2;
		break;
	}
	callback(hero);
}

PrototypeHeroModel = mongoose.model('PrototypeHero', PrototypeHeroSchema);