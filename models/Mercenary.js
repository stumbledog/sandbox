var MercenarySchema = new Schema({
	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
});

MercenarySchema.methods.init = function(){

}

MercenaryModel = mongoose.model('Mercenary', MercenarySchema);