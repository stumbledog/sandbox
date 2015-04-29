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
	purchase:function(item_builder, slot_index, repurchase, user_id, callback){
		console.log(repurchase);
		if(item_builder.type === "weapon"){
			var item = new WeaponModel(item_builder);
		}else{
			var item = new ArmorModel(item_builder);
		}

		UserModel.findById(user_id, function(err, user){
			var price = Math.ceil(item.price / (repurchase ? 2 : 1));
			if(user.gold >= price){
				item.save();
				user.gold -= price;
				if(item_builder.type === "weapon"){
					user.inventory.slots.push({index:slot_index, weapon:item._id});
				}else{
					user.inventory.slots.push({index:slot_index, armor:item._id});
				}
				user.markModified('inventory.slots');
				user.save(function(){
					callback({gold:user.gold});
				})
			}else{
				callback({err:true, err_msg:"Not enough gold"});
			}
		});
	},
	moveItem:function(from, to, user_id, callback){
		var source_item, target_item;
		UserModel.findById(user_id, 'inventory', function(err, user){
			var source_item = user.inventory.slots.filter(function(slot){
				return slot.index === from;
			});

			var target_item = user.inventory.slots.filter(function(slot){
				return slot.index === to;
			});

			if(target_item.length){
				target_item[0].index = -1;
				source_item[0].index = to;
				target_item[0].index = from;
			}else{
				source_item[0].index = to;
			}

			user.markModified('inventory.slots');
			user.save(function(err, user){
				callback({inventory:user.inventory.slots});
			})			
		});
	},
	saveInventory:function(items, user_id, callback){
		UserModel.update({_id:user_id},{"inventory.slots":items}, callback);
	},
	addGold:function(gold, user_id, callback){
		console.log(gold);
		UserModel.findOneAndUpdate({_id:user_id}, {$inc:{"gold":gold}}, function(err, user){
			console.log(err);
			console.log(user);
			callback(null);
		});
	},
	sellItem:function(slot_index, price, user_id, callback){
		UserModel.findById(user_id, 'inventory gold', function(err, user){
			UserModel.update({_id:user_id},{$inc:{gold:price}, $pull:{'inventory.slots':{index:slot_index}}}, callback);
		});
	},
	lootItem:function(loot_item, callback){
		console.log(loot_item._id);
		delete loot_item._id;
		if(loot_item.type === "weapon"){
			var item = new WeaponModel(loot_item);
		}else{
			var item = new ArmorModel(loot_item);
		}
		item.save(callback);
	}
}