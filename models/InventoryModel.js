var InventorySchema = new Schema({
	capacity:Number,
	slots:[{
		type:Schema.Types.ObjectId,
		ref:'Item'
	}]
});

InventoryModel = mongoose.model('Inventory', InventorySchema);