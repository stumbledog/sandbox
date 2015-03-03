var NPCSchema = new Schema({
	_id:Number,
	name:String,
	sprite:String,
	//portrait:String,
	index:Number,
	type:String,	//recruiter, merchant, blacksmith, battlemaster
});

NPCModel = mongoose.model('NPC', NPCSchema);