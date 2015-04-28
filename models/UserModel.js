var UserUnitSchema = new Schema({
	model:{type:Schema.Types.ObjectId, ref:"Unit"},
	level:{type:Number, default:1},
	exp:{type:Number, default:0},
	equipments:[{
		part:String,
		armor:{type:Schema.Types.ObjectId, ref:"Armor"},
		weapon:{type:Schema.Types.ObjectId, ref:"Weapon"},
	}],
});

UserUnitModel = mongoose.model('UserUnit', UserUnitSchema);

var UserSchema = new Schema({
	name:String,
	gold:{type:Number, default:10000},
	hero:{type:Schema.Types.ObjectId, ref:"UserUnit"},
	followers:[{type:Schema.Types.ObjectId, ref:"UserUnit"}],
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