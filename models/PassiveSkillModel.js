var PassiveSkillSchema = new Schema({
	name:String,
	description:String,
	key:String,
});

PassiveSkillModel = mongoose.model('PassiveSkill', PassiveSkillSchema);