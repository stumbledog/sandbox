var UserSchema = new Schema({
	name:String,
	gold:{type:Number, default:1000},
	inventory:{
		capacity:{type:Number, default:90},
		slots:[{type:Schema.Types.Mixed}]
	},
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