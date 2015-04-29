var SkillSchema = new Schema({
	name:String,
	description:String,
	key:String,
	target:Boolean,
	range:Number,
	radius:Number,
	angle:Number,
	damage:Number,
	cost:Number,
	cooldown:Number,
	icon_source:String,
	animation:Schema.Types.Mixed,
});

SkillModel = mongoose.model('Skill', SkillSchema);