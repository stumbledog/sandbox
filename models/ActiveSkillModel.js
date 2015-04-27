var ActiveSkillSchema = new Schema({
	name:String,
	description:String,
	key:String,
	target:Boolean,
	range:Number,
	radius:Number,
	damage:Number,
	cost:Number,
	cooldown:Number,
	icon_source:String,
	animation:Schema.Types.Mixed,
});

ActiveSkillModel = mongoose.model('ActiveSkill', ActiveSkillSchema);