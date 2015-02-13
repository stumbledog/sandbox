var UserModel = new Schema({
	name:String,
	gold:Number,
	last_logged_in:{type: Date, default: Date.now},
	created_at:{type: Date, default: Date.now},
});

mongoose.model('User', UserModel);