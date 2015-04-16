var FollowerSchema = new Schema({
	character_class:String,
	primary_attribute:String,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	sprite:String,
	portrait:String,
	index:Number,
	level:Number,
	exp:Number,
	items:Schema.Types.Mixed,
	passive_skills:Schema.Types.Mixed,
	active_skills:Schema.Types.Mixed,
	level_up_bonus:{
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
	},
	equipments:{
		head:Schema.Types.Mixed,
		chest:Schema.Types.Mixed,
		gloves:Schema.Types.Mixed,
		boots:Schema.Types.Mixed,
		belt:Schema.Types.Mixed,
		cape:Schema.Types.Mixed,
		necklace:Schema.Types.Mixed,
		right_ring:Schema.Types.Mixed,
		left_ring:Schema.Types.Mixed,
		main_hand:Schema.Types.Mixed,
		off_hand:Schema.Types.Mixed,
	}
});

var UserSchema = new Schema({
	name:String,
	gold:{type:Number, default:10000},
	hero:{
		name:String,
		primary_attribute:String,
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
		sprite:String,
		portrait:String,
		index:Number,
		level:Number,
		exp:Number,
		resource_type:String,
		items:Schema.Types.Mixed,
		passive_skills:Schema.Types.Mixed,
		active_skills:Schema.Types.Mixed,
		level_up_bonus:{
			strength:Number,
			agility:Number,
			intelligence:Number,
			stamina:Number,
		},
		equipments:{
			head:Schema.Types.Mixed,
			chest:Schema.Types.Mixed,
			gloves:Schema.Types.Mixed,
			boots:Schema.Types.Mixed,
			belt:Schema.Types.Mixed,
			cape:Schema.Types.Mixed,
			necklace:Schema.Types.Mixed,
			right_ring:Schema.Types.Mixed,
			left_ring:Schema.Types.Mixed,
			main_hand:Schema.Types.Mixed,
			off_hand:Schema.Types.Mixed,
		}
	},
	followers:[FollowerSchema],
	inventory:{
		capacity:{type:Number, default:90},
		slots:[Schema.Types.Mixed]
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