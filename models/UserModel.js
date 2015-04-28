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
	gold:{type:Number, default:50},
	hero:{
		model:{type:Schema.Types.ObjectId, ref:"Unit"},
		level:{type:Number, default:1},
		exp:{type:Number, default:0},
		equipments:{
			head:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			chest:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			gloves:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			boots:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			belt:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			cape:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			necklace:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			right_ring:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			left_ring:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			main_hand:{type:Schema.Types.ObjectId, ref:"Item", default:null},
			off_hand:{type:Schema.Types.ObjectId, ref:"Item", default:null},
		}
	},
	followers:[FollowerSchema],
	inventory:{
		capacity:{type:Number, default:90},
		slots:[{
			index:Number,
			weapon:{type:Schema.Types.ObjectId, ref:"Weapon"},
			armor:{type:Schema.Types.ObjectId, ref:"Armor"},
		}]
	},
	created_at:{type: Date, default: Date.now},
	last_logged_in:{type: Date, default: Date.now},
});

UserModel = mongoose.model('User', UserSchema);