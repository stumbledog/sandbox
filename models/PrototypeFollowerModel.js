var PrototypeFollowerSchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});

PrototypeFollowerSchema.methods.initFollower = function(level, callback){
	var follower = this.toObject();
	follower.level = level;
	follower.exp = 0;

	follower.strength = level;
	follower.agility = level;
	follower.intelligence = level;
	follower.stamina = 2 * level;

	switch(this.primary_attribute){
		case "strength":
			follower.strength *= 2;
		break;
		case "agility":
			follower.agility *= 2;
		break;
		case "intelligence":
			follower.intelligence *= 2;
		break;
	}
	callback(follower);
}

PrototypeFollowerSchema.methods.setRecruitableFollower = function(level){
	var follower = this.toObject();
	follower.level = level;
	follower.exp = 0;

	follower.strength = level;
	follower.agility = level;
	follower.intelligence = level;
	follower.stamina = 2 * level;
	follower.price = 100 * level;

	switch(this.primary_attribute){
		case "strength":
			follower.strength *= 2;
		break;
		case "agility":
			follower.agility *= 2;
		break;
		case "intelligence":
			follower.intelligence *= 2;
		break;
	}

	return follower;
}

PrototypeFollowerModel = mongoose.model('PrototypeFollower', PrototypeFollowerSchema);