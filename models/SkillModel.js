var SkillSchema = new Schema({
	key:String,
	name:String,
	description:String,
	src:String,
	resource:String,
	radius:Number,
	angle:Number,
	type:String,
	damage:Number,
	cost:Number,
	cooldown:Number,
	animation:{
		scale:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		images:[{src:String, index:String}]
	}
});

mongoose.model('Skill', SkillSchema);