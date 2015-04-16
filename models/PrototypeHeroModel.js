var PrototypeHeroSchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	passive_skills:Schema.Types.Mixed,
	active_skills:Schema.Types.Mixed,
});

PrototypeHeroSchema.methods.initHero = function(callback){
	var hero = this.toObject();
	hero.level = 1;
	hero.exp = 0;
	hero.items = [];

	hero.strength = 1;
	hero.agility = 1;
	hero.intelligence = 1;
	hero.stamina = 2;

	hero.level_up_bonus = {};
	hero.level_up_bonus.strength = 1;
	hero.level_up_bonus.agility = 1;
	hero.level_up_bonus.intelligence = 1;
	hero.level_up_bonus.stamina = 2;

	switch(this.primary_attribute){
		case "strength":
			hero.strength = hero.level_up_bonus.strength = 2;
		break;
		case "agility":
			hero.agility = hero.level_up_bonus.agility = 2;
		break;
		case "intelligence":
			hero.intelligence = hero.level_up_bonus.intelligence = 2;
		break;
	}
	callback(hero);
}

PrototypeHeroModel = mongoose.model('PrototypeHero', PrototypeHeroSchema);