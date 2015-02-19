var InventorySchema = new Schema({
	number_of_slots:String,
	_user:{
		type:Schema.Types.ObjectId,
		ref:'User'
	},
	slots:[{
		type:Schema.Types.ObjectId,
		ref:'Item'
	}]
});

InventoryModel = mongoose.model('Inventory', InventorySchema);