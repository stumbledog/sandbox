ItemController = {
	loadMerchantItem:function(callback){
		PrototypeWeaponModel.find({}, callback);
	},
	generateMerchantItem:function(level, callback){
		var items = [];
		PrototypeWeaponModel.find().exec(function(err, prototype_weapons){
			for(var i = 0 ; i < 18 ; i++){
				var weapon = prototype_weapons[Math.floor(Math.random() * prototype_weapons.length)].toObject();
				weapon.level = level;
				weapon.price = 0;
				weapon.min_damage *= level;
				weapon.max_damage *= level;
				weapon.rating = Math.ceil(Math.random() * 3);

				weapon.attributes = []
				while(weapon.attributes.length < weapon.rating){
					var randomnumber = Math.floor(Math.random() * 6)
					var found=false;
					for(var j = 0 ; j < weapon.attributes.length ; j++){
						if(weapon.attributes[j] === randomnumber){
							found=true;
							break;
						}
					}
					if(!found){
						weapon.attributes[weapon.attributes.length] = randomnumber;
					}
				}
				weapon.attributes.sort();
				weapon.attributes.forEach(function(attribute){
					switch(attribute){
						case 0:
							weapon.min_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.5))*10)/10;
							weapon.max_damage_bonus = Math.round(((0.5 + weapon.hand / 2) * level * (0.5 + weapon.rating / 2) * (Math.random() / 4 + 0.75))*10)/10;
							weapon.price += (weapon.min_damage_bonus + weapon.max_damage_bonus) * 2;
						break;
						case 1:
							weapon.attack_speed_bonus = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
							weapon.price += level * weapon.attack_speed_bonus;
						break;
						case 2:
							var value = Math.ceil(level * (weapon.rating) * (Math.random() / 4 + 0.75));
							weapon.price += value;
							weapon.primary_attribute = weapon.primary_attribute === 3 ? Math.floor(Math.random() * 3) : weapon.primary_attribute;
							switch(weapon.primary_attribute){
								case 0:
									weapon.strength = value;
								break;
								case 1:
									weapon.agility = value;
								break;
								case 2:
									weapon.intelligence = value;
								break;
							}
						break;
						case 3:
							weapon.critical_rate = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
							weapon.price += weapon.critical_rate * level;
						break;
						case 4:
							weapon.critical_damage = (weapon.rating - 1) * 10 + Math.ceil(Math.random() * 10);
							weapon.price += weapon.critical_damage * level / 5;
						break;
						case 5:
							weapon.life_steal = (weapon.rating - 1) * 2 + Math.ceil(Math.random() * 2);
							weapon.price += weapon.life_steal * level;
						break;
					}
				});
				weapon.price = Math.ceil(weapon.price);
				items.push(weapon);
			}
		}).then(function(ret){
			PrototypeArmorModel.find({}, function(err, prototype_armors){
				for(var i = 0 ; i < 18 ; i++){
					var armor = prototype_armors[Math.floor(Math.random() * prototype_armors.length)].toObject();
					armor.level = level;
					armor.price = 0;
					armor.rating = Math.ceil(Math.random() * 3);

					switch(armor.part){
						case 0:
						case 1:
						case 6:
							armor.armor = Math.ceil(2 * level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
						break;
						case 2:
						case 3:
						case 4:
						case 5:
							armor.armor = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
						break;
						default:
							armor.armor = 0;
						break;
					}

					armor.attributes = []
					while(armor.attributes.length < armor.rating){
						var randomnumber = Math.floor(Math.random() * 11)
						var found=false;
						for(var j = 0 ; j < armor.attributes.length ; j++){
							if(armor.attributes[j] === randomnumber){
								found=true;
								break;
							}
						}
						if(!found){
							armor.attributes[armor.attributes.length] = randomnumber;
						}
					}

					armor.attributes.sort();
					armor.attributes.forEach(function(attribute){
						switch(attribute){
							case 0:
								armor.armor_bonus = Math.ceil(level * (0.5 + armor.rating / 2) * (Math.random() / 4 + 0.75));
								armor.price = armor.armor_bonus;
							break;
							case 1:
								armor.attack_speed_bonus = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
								armor.price += level * armor.attack_speed_bonus;
							break;
							case 2:
								armor.movement_speed = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
								armor.price += level * armor.movement_speed;
							break;
							case 3:
								var value = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
								armor.price += value;
								armor.primary_attribute = armor.primary_attribute === 3 ? Math.floor(Math.random() * 3) : armor.primary_attribute;
								switch(armor.primary_attribute){
									case 0:
										armor.strength = value;
									break;
									case 1:
										armor.agility = value;
									break;
									case 2:
										armor.intelligence = value;
									break;
								}
							break;
							case 4:
								armor.stamina = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75));
								armor.price += armor.stamina;
							break;
							case 5:
								armor.critical_rate = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
								armor.price += armor.critical_rate * level;
							break;
							case 6:
								armor.critical_damage = (armor.rating - 1) * 10 + Math.ceil(Math.random() * 10);
								armor.price += armor.critical_damage * level / 5;
							break;
							case 7:
								armor.life_steal = (armor.rating - 1) * 2 + Math.ceil(Math.random() * 2);
								armor.price += armor.life_steal * level;
							break;
							case 8:
								armor.cooldown_reduce = armor.rating;
								armor.price += 2 * level * armor.cooldown_reduce;
							break;
							case 9:
								armor.health_regen = Math.ceil(level * (armor.rating) * (Math.random() / 4 + 0.75) / 2);
								armor.price += armor.health_regen * 2;
							break;
							case 10:
								armor.mana_regen = Math.ceil((armor.rating) * (Math.random() / 4 + 0.75) / 2);
								armor.price += armor.mana_regen * 2 * level;
							break;
						}
					});
					armor.price = Math.ceil(armor.price);
					items.push(armor);
					callback(err, items);
				}
			});
		});
	},

}