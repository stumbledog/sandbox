var ItemSchema = new Schema({
	index:Number,
	primary_attribute:Number,
	part:Number,
	hand:Number,
	type:String,
	attack_type:String,
	name:String,
	sprite:{
		source:String,
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	icon:{
		source:String,
		cropX:Number,
		cropY:Number,
		width:Number,
		height:Number,
		regX:Number,
		regY:Number,
		scale:Number,
	},
	min_damage:Number,
	max_damage:Number,
	attack_speed:Number,
	range:Number,
	level:Number,
	price:Number,
	sell_price:Number,
	rating:Number,
	min_damage_bonus:Number,
	max_damage_bonus:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	attack_speed_bonus:Number,
	movement_speed:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
	armor:Number,
	armor_bonus:Number,
	cooldown_reduce:Number,
	health_regen:Number,
	resource_regen:Number,
	attributes:Schema.Types.Mixed,
	qty:Number,
	health:Number,
	resource:Number,
	cooldown:Number,
});

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
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}],
	level_up_bonus:{
		strength:Number,
		agility:Number,
		intelligence:Number,
		stamina:Number,
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
		_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}],
		level_up_bonus:{
			strength:Number,
			agility:Number,
			intelligence:Number,
			stamina:Number,
		}
	},
	followers:[FollowerSchema],
	inventory:{
		capacity:{type:Number, default:90},
		slots:[ItemSchema]
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