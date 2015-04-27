ItemController = {
	loadMerchantItem:function(callback){
		WeaponModel.find({}, callback);
	},
	generateMerchantItem:function(level, callback){
		var items = [];
		WeaponModel.find().exec(function(err, weapons){
			for(var i = 0 ; i < 18 ; i++){
				var weapon = weapons[Math.floor(Math.random() * weapons.length)];
				items.push(weapon.setMerchantItem(level));
			}
		}).then(function(){
			ArmorModel.find({}, function(err, armors){
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
			WeaponModel.find({}, function(err, weapons){
				var weapon = weapons[Math.floor(Math.random() * weapons.length)];
				callback(weapon.setMerchantItem(level, rating));
			});
		}else{
			ArmorModel.find({}, function(err, armors){
				var armor = armors[Math.floor(Math.random() * armors.length)];
				callback(armor.setMerchantItem(level, rating));
			});
		}
	},
	purchase:function(item, user_id, callback){
		console.log(item);
		var price = item.repurchase === "true" ? parseInt(item.sell_price) : parseInt(item.price);
		var total_price = price * parseInt(item.qty);
		UserModel.findById(user_id, function(err, user){
			if(user.gold >= total_price){
				if(item.type === "consumable"){
					var find = false;
					user.inventory.slots.forEach(function(slot_item){
						if(slot_item.name === item.name){
							slot_item.qty += parseInt(item.qty);
							find = true;
							return false;
						}
					});
					if(!find){
						user.inventory.slots.push(item);
					}
				}else{
					user.inventory.slots.push(item);
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