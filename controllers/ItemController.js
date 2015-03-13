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

}