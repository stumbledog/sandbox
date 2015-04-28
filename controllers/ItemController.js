ItemController = {
	loadMerchantItem:function(callback){
		WeaponModel.find({}, callback);
	},
	generateMerchantItem:function(level, callback){
		var items = [];
		MerchantWeaponModel.find().exec(function(err, weapons){
			for(var i = 0 ; i < 18 ; i++){
				var weapon = weapons[Math.floor(Math.random() * weapons.length)];
				items.push(weapon.setMerchantItem(level));
			}
		}).then(function(){
			MerchantArmorModel.find({}, function(err, armors){
				for(var i = 0 ; i < 18 ; i++){
					var armor = armors[Math.floor(Math.random() * armors.length)];
					items.push(armor.setMerchantItem(level));
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
	dropItem:function(level, rating, callback){
		if(Math.random() > 0.8){
			MerchantWeaponModel.find({}, function(err, weapons){
				var weapon = weapons[Math.floor(Math.random() * weapons.length)];
				callback(weapon.setMerchantItem(level, rating));
			});
		}else{
			MerchantArmorModel.find({}, function(err, armors){
				var armor = armors[Math.floor(Math.random() * armors.length)];
				callback(armor.setMerchantItem(level, rating));
			});
		}
	},
	purchase:function(item_builder, slot_index, user_id, callback){
		console.log(item_builder);
		console.log(slot_index);
		var price = item_builder.repurchase === "true" ? parseInt(item_builder.sell_price) : parseInt(item_builder.price);
		var total_price = price * parseInt(item_builder.qty);
		UserModel.findById(user_id, function(err, user){
			if(user.gold >= total_price){
				if(item_builder.type === "consumable"){
					var find = false;
					user.inventory.slots.forEach(function(slot_item){
						if(slot_item.name === item_builder.name){
							slot_item.qty += parseInt(item_builder.qty);
							find = true;
							return false;
						}
					});
					if(!find){
						user.inventory.slots.push(item_builder);
					}
				}else{
					var item = new ItemModel(item_builder);
					item.save();
					user.inventory.slots.push({index:slot_index, item:item._id});
				}
				UserModel.findOneAndUpdate({_id:user._id}, {gold:user.gold - total_price, inventory:user.inventory}, function(err, user){
					callback({gold:user.gold});
				});
			}else{
				callback({err:true, err_msg:"Not enough gold"});
			}
		});
	},
	saveInventory:function(items, user_id, callback){
		UserModel.findOneAndUpdate({_id:user_id}, {"inventory.slots":items}, function(){
			callback(null);
		});
	},
	addGold:function(gold, user_id, callback){
		console.log(gold);
		UserModel.findOneAndUpdate({_id:user_id}, {$inc:{"gold":gold}}, function(err, user){
			console.log(err);
			console.log(user);
			callback(null);
		});
	},
	sellItem:function(item_id, user_id, callback){
		UserModel.findById(user_id, function(err, user){
			var item = user.inventory.slots.id(item_id);
			console.log(item.sell_price, item.qty);
			user.gold += item.sell_price * item.qty;
			item.remove();
			user.markModified('inventory.slots');
			user.save(function(err, user){
				callback({gold:user.gold});
			});
		});
	}
}