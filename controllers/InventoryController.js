InventoryController = {
	createInventory:function(user_id, callback){
		var inventory = new InventoryModel({number_of_slots:24,_user:user_id});
		inventory.save(callback);
	},
	addSlots:function(user_id, slots_length, callback){
		InventoryModel.find({_user:user_id}, function(err, inventory){
			inventory.number_of_slots += slots_length;
			inventory.save(callback);
		});
	},
	saveInventory:function(user_id, slots, callback){
		InventoryModel.find({_user:user_id}, function(err, inventory){
			inventory.slots = slots;
			inventory.save(callback);
		});
	}
}