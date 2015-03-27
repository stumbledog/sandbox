ItemController = {
	loadMerchantItem:function(callback){
		PrototypeWeaponModel.find({}, callback);
	},
	generateMerchantItem:function(level, callback){
		var items = [];
		PrototypeWeaponModel.find().exec(function(err, prototype_weapons){
			for(var i = 0 ; i < 18 ; i++){
				var prototype_weapon = prototype_weapons[Math.floor(Math.random() * prototype_weapons.length)];
				items.push(prototype_weapon.setMerchantItem(level));
			}
		}).then(function(){
			PrototypeArmorModel.find({}, function(err, prototype_armors){
				for(var i = 0 ; i < 18 ; i++){
					var prototype_armor = prototype_armors[Math.floor(Math.random() * prototype_armors.length)];
					items.push(prototype_armor.setMerchantItem(level));
				}	
			});
		}).then(function(){
			PrototypeConsumableItemModel.find({}, function(err, prototype_consumable_items){
				prototype_consumable_items.forEach(function(prototype_consumable_item){
					items.push(prototype_consumable_item.setMerchantItem(level));
				});
				callback(err, items);
			});
		});
	},
	purchase:function(item, user_id, callback){
		console.log(item);
		UserModel.findById(user_id, function(err, user){
			if(user.gold >= item.price){
				if(item.type === "consumable"){
					var find = false;
					user.inventory.slots.forEach(function(slot_item){
						if(slot_item.name === item.name){
							slot_item.qty++;
							find = true;
							return false;
						}
					});
					if(!find){
						item.qty = 1;
						user.inventory.slots.push(item);
					}
				}else{
					user.inventory.slots.push(item);
				}
				UserModel.findOneAndUpdate({_id:user._id}, {gold:user.gold - item.price, inventory:user.inventory}, function(user){
					console.log(user.inventory.slots);
					callback(null);
				});
			}else{
				callback("Not enough gold");
			}
		});
	},
	saveInventory:function(items, user_id, callback){
		UserModel.findOneAndUpdate({_id:user_id}, {"inventory.slots":items}, function(){
			callback(null);
		});
	},
	sellItem:function(items, user_id, callback){
		UserModel.findOneAndUpdate({_id:user_id}, {"inventory.slots":items}, function(){
			callback(null);
		});
	}
}