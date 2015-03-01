var UserSchema = new Schema({
	name:String,
	gold:Number,
	_inventory:[{
		type:Schema.Types.ObjectId,
		ref:'Item'
	}],
	last_logged_in:{type: Date, default: Date.now},
	created_at:{type: Date, default: Date.now},
	updated_at:{type: Date, default: Date.now},
});

UserSchema.pre('save', function(next){
	now = new Date();
	this.updated_at = now;
	if ( !this.created_at ) {
		this.created_at = now;
	}
	next();
});

UserModel = mongoose.model('User', UserSchema);