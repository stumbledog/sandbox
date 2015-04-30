function Inventory(builder, user){
	this.initialize(builder, user);
}

Inventory.prototype = new createjs.Container();
Inventory.prototype.constructor = Inventory;
Inventory.prototype.container_initialize = Inventory.prototype.initialize;

Inventory.prototype.initialize = function(builder, user){
	this.container_initialize();
	this.game = Game.getInstance();
	this.user = user;
	this.loader = this.game.getLoader();

	this.width = 310;
	this.height = 540;
	this.isOpen = false;
	this.capacity = builder.capacity;
	this.drag_item = null;
	this.containers = [];
	this.selectedCharacter = null;

	this.initFrame();
	this.initEquipItemContainers();
	this.initStatsTypeContainer();
	this.initItemContainers();
	if(builder.slots){
		this.initInventoryItem(builder.slots);
	}
}

Inventory.prototype.initFrame = function(){
	var frame = new createjs.Shape();
	frame.graphics.s("#000").f("#E6E2AF").dr(5,10,302,530);

	this.gold = new OutlineText(this.user.gold, "Arial 16px", "#FFD34E", "#000", 3);
	this.gold.x = 310 - this.gold.getMeasuredWidth() - 22;
	this.gold.y = 525;

	this.coin = new createjs.Bitmap(this.loader.getResult("icon"));
	this.coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
	this.coin.x = 290;
	this.coin.y = 524;

	this.units_container = new createjs.Container();
	this.units_container.x = 6;
	this.units_container.y = 11;

	this.unit_detail_container = new createjs.Container();
	this.unit_detail_container.y = 200;
	this.unit_detail_container.visible = false;;

	var bg = new createjs.Shape();
	bg.graphics.s("#000").f("#ccc").rr(8,-2,296,195,2);
	bg.alpha = 0.9;

	this.unit_sprite_container = new createjs.Container();
	this.unit_sprite_container.x = 230;
	this.unit_sprite_container.y = 64;

	this.close_button = new createjs.Container();
	this.close_button.x = 280;
	this.close_button.cursor = "pointer";
	this.close_button.addEventListener("mousedown", function(){
		this.selectedCharacter = null;
		this.selectCharacterBorder.visible = false;
		this.unit_detail_container.visible = false;
	}.bind(this));

	this.close_button_bg = new createjs.Shape();
	this.close_button_bg.graphics.s("#000").f("#8E2800").dr(0,0,20,20);

	this.close_icon = new createjs.Shape();
	this.close_icon.graphics.s("#FFF0A5").ss(3).mt(5,5).lt(15,15).mt(5,15).lt(15,5);
	this.close_button.addChild(this.close_button_bg, this.close_icon);

	this.selectCharacterBorder = new createjs.Shape();
	this.selectCharacterBorder.graphics.s("#E74C3C").ss(4).dr(2,2,46,46);
	this.selectCharacterBorder.alpha = 0.8;
	this.selectCharacterBorder.visible = false;
	this.selectCharacterBorder.x = 6;
	this.selectCharacterBorder.y = 11;

	this.unit_detail_container.addChild(bg, this.unit_sprite_container, this.close_button);
	this.addChild(frame, this.gold, this.coin, this.units_container, this.selectCharacterBorder, this.unit_detail_container);
}

Inventory.prototype.initStatsTypeContainer = function(){
	this.statsText = {};
	this.stats_container = new createjs.Container();
	this.initStatsType("Level", 10, 0);

	this.initStatsType("Strength", 10, 10);
	this.initStatsType("Agility", 10, 20);
	this.initStatsType("Intelligence", 10, 30);
	this.initStatsType("Stamina", 10, 40);

	this.initStatsType("Health", 10, 60);
	this.initStatsType("Resource", 10, 70);
	this.initStatsType("Health Regen", 10, 80);
	this.initStatsType("Resource Regen", 10, 90);
	this.initStatsType("Armor", 10, 100);
	this.initStatsType("Damage Reduction", 10, 110);

	this.initStatsType("Right Damage", 10, 130);
	this.initStatsType("Left Damage", 10, 140);
	this.initStatsType("Right Att. Speed", 10, 150);
	this.initStatsType("Left Att. Speed", 10, 160);
	this.initStatsType("Crit. Rate", 10, 170);
	this.initStatsType("Crit. Damage", 10, 180);

	this.initStatsType("DPS", 160, 140);

	this.initStatsType("Life Steal", 160, 160);
	this.initStatsType("Cooldown Reduction", 160, 170);
	this.initStatsType("Movement Speed", 160, 180);

	this.unit_detail_container.addChild(this.stats_container);
}

Inventory.prototype.initStatsType = function(text, x, y){
	var stat_type = new createjs.Text(text, "bold Arial 10px", "#000");
	stat_type.x = x;
	stat_type.y = y;
	this.statsText[text] = new createjs.Text("", "bold Arial 10px", "#000");
	this.statsText[text].x = x;
	this.statsText[text].y = y;

	this.stats_container.addChild(stat_type, this.statsText[text]);
}

Inventory.prototype.displayStats = function(unit){
	this.statsText["Level"].text = unit.level;
	this.statsText["Strength"].text = unit.strength;
	this.statsText["Agility"].text = unit.agility;
	this.statsText["Intelligence"].text = unit.intelligence;
	this.statsText["Stamina"].text = unit.stamina;

	this.statsText["Health"].text = unit.max_health;
	this.statsText["Resource"].text = unit.max_resource;
	this.statsText["Health Regen"].text = unit.health_regen;
	this.statsText["Resource Regen"].text = unit.resource_regen;
	this.statsText["Armor"].text = unit.armor;
	this.statsText["Damage Reduction"].text = (unit.damage_reduction * 100).toFixed(1) + "%";

	this.statsText["Right Damage"].text = unit.right_min_damage + " - " + unit.right_max_damage;
	this.statsText["Left Damage"].text = unit.left_min_damage + " - " + unit.left_max_damage;
	this.statsText["Right Att. Speed"].text = Math.round(60 / unit.right_attack_speed * 100)/100;
	this.statsText["Left Att. Speed"].text = unit.left_attack_speed ? (60 / unit.left_attack_speed).toFixed(2) : 0;
	this.statsText["Crit. Rate"].text = unit.critical_rate + "%";
	this.statsText["Crit. Damage"].text = "+"+unit.critical_damage + "%";

	this.statsText["DPS"].text = unit.dps.toFixed(2);

	this.statsText["Life Steal"].text = unit.life_steal + "%";
	this.statsText["Cooldown Reduction"].text = unit.cooldown_reduction + "%";
	this.statsText["Movement Speed"].text = unit.movement_speed;

	for(key in this.statsText){
		if(key === "DPS" || key === "Life Steal" || key === "Cooldown Reduction" || key === "Movement Speed"){
			this.statsText[key].x = 300 - this.statsText[key].getMeasuredWidth();
		}else{
			this.statsText[key].x = 150 - this.statsText[key].getMeasuredWidth();
		}
	}
}

Inventory.prototype.displayEquipItems = function(unit){
	this.equip_item_container.children.forEach(function(container){
		container.removeChildAt(2);
	});

	for(key in unit.equipments){
		var item = unit.equipments[key];
		if(item){
			var equip_container = this.equip_item_container.getChildByName(key);
			var container = new createjs.Container();
			var border = new createjs.Shape();
			border.graphics.s("#000").ss(1).f(item.colors[item.rating-1]).dr(0,0,20,20);
			var icon = item.icon_img.clone();
			icon.x = icon.y = 10;
			container.addChild(border, icon);
			container.addEventListener("rollover", function(equip_container, item, event){
				var x = equip_container.x - 140;
				var y = equip_container.y + 200;
				item.showDetail(x, y, this.stage);
				this.stage.update();
			}.bind(this, equip_container, item));
			container.addEventListener("rollout", function(item, event){
				if(this.stage){
					this.stage.removeChild(item.detail);
					this.stage.update();
				}
			}.bind(this, item));
			container.addEventListener("mousedown", function(item, key, container, event){
				if(event.nativeEvent.button === 2){
					this.addItem(item);
					unit.equipments[key] = null;
					container.removeAllChildren();
					this.selectedCharacter.saveItems();
					//this.user.saveEquipItems();
					unit.updateStats();
					this.displayStats(unit);
				}
			}.bind(this, item, key, container));
			equip_container.addChild(container);
		}
	}
}

Inventory.prototype.initEquipItemContainers = function(){
	this.equip_item_container = new createjs.Container();
	this.initEquipItemContainer("head", 220, 40, 244, 149, 16, 15);
	this.initEquipItemContainer("chest", 220, 60, 316, 125, 16, 15);
	this.initEquipItemContainer("gloves", 180, 70, 99, 126, 15, 15);
	this.initEquipItemContainer("boots", 220, 100, 173, 173, 15, 16);
	this.initEquipItemContainer("belt", 220, 80, 340, 150, 16, 15);
	this.initEquipItemContainer("cape", 240, 50, 4, 173, 16, 16);
	this.initEquipItemContainer("necklace", 200, 50, 148, 173, 16, 15);
	this.initEquipItemContainer("right_ring", 200, 80, 78, 176, 12, 12);
	this.initEquipItemContainer("left_ring", 240, 80, 78, 176, 12, 12);
	this.initEquipItemContainer("main_hand", 180, 90, 245, 103, 13, 14);
	this.initEquipItemContainer("off_hand", 260, 90, 198, 149, 13, 16);
	this.unit_detail_container.addChild(this.equip_item_container);
}

Inventory.prototype.initEquipItemContainer = function(part, x, y, cropX, cropY, width, height){
	var container = new createjs.Container();
	container.name = part;
	container.x = x;
	container.y = y;

	var border = new createjs.Shape();
	border.graphics.s("#000").f("#ccc").rr(0,0,20,20,3);

	var icon = new createjs.Bitmap(this.loader.getResult("icon"));
	icon.sourceRect = new createjs.Rectangle(cropX, cropY, width, height);
	icon.filters = [new createjs.ColorFilter(0.5, 0.5, 0.5, 1, 150, 150, 150)];
	icon.cache(0,0,width,height);
	icon.x = (20 - width) / 2;
	icon.y = (20 - height) / 2;
	container.addChild(border, icon);

	this.equip_item_container.addChild(container);
}

Inventory.prototype.initItemContainers = function(){
	for(var i = 0 ; i < this.capacity ; i++){
		var container = new createjs.Container();
		var border = new createjs.Shape();
		container.x = (i % 15) * 20 + 6;
		container.y = Math.floor(i / 15) * 20 + 400;
		container.index = i;
		border.graphics.s("#000").f("#fff").dr(0,0,20,20);
		container.addChild(border);
		this.addChild(container);
		this.containers.push(container);

		container.addEventListener("mousedown", function(event){
			if(event.nativeEvent.button === 0){
				if(this.drag_item){
					if(event.currentTarget.children.length > 1){
						event.currentTarget.children[1].item.index = this.drag_item.parent.index;
						var swap_item = event.currentTarget.children[1];
						swap_item.item.index = this.drag_item.parent.index;
						this.drag_item.parent.addChild(swap_item);
						this.drag_item.item.index = event.currentTarget.index;
						event.currentTarget.addChild(this.drag_item);
						this.drag_item = null;
					}else{
						this.drag_item.item.index = event.currentTarget.index;
						event.currentTarget.addChild(this.drag_item);
						this.drag_item = null;
					}
					this.saveInventory();
				}else{
					if(event.currentTarget.children.length > 1){
						this.drag_item = event.currentTarget.children[1];
					}
				}
			}else if(event.nativeEvent.button === 2){
				if(event.currentTarget.children.length > 1){
					if(this.user.store && this.user.store.constructor.name === "MerchantStore"){
						var item = event.currentTarget.children[1].item;
						$.post("sellitem", {slot_index:event.currentTarget.index, price:item.sell_price}, function(res){
							console.log(res);
							//this.sellItem(item);
							this.user.store.sellItem(item);
							this.user.addGold(Math.ceil(item.price/2));
							event.currentTarget.removeChildAt(1);
							this.stage.update();
						}.bind(this));
					}else{
						if(this.selectedCharacter){
							var item = event.currentTarget.children[1].item;
							event.currentTarget.removeChildAt(1);
							this.selectedCharacter.equipItem(item);
							this.displayStats(this.selectedCharacter);
						}
					}
				}
			}
			this.stage.update();
		}.bind(this));
	}
}

Inventory.prototype.initInventoryItem = function(items){
	items.forEach(function(item){
		item.index = parseInt(item.index);
		if(item.weapon){
			var weapon = new Weapon(item.weapon);
			this.containers[item.index].addChild(this.initItemIcon(weapon, item.index));
		}else if(item.armor){
			var armor = new Armor(item.armor);
			this.containers[item.index].addChild(this.initItemIcon(armor, item.index));
		}
		/*
		switch(item.type){
			case "weapon":
				var weapon = new Weapon(item);
				this.containers[item.index].addChild(this.initItemIcon(weapon, item.index));
			break;
			case "armor":
				var armor = new Armor(item);
				this.containers[item.index].addChild(this.initItemIcon(armor, item.index));
			break;
			case "consumable":
				var consumable = new Consumable(item);
				this.containers[item.index].addChild(this.initItemIcon(consumable, item.index));
			break;
		}*/
	}, this);
}

Inventory.prototype.addItem = function(item){
	if(item.constructor.name === "Consumable"){
		var find = false;
		var index = this.findItem(item);
		if(index > -1){
			this.containers[index].children[1].item.qty += item.qty;
			this.updateQuantity(index);
		}else{
			var empty_index = this.getEmptySlot();
			if(empty_index >= 0){
				this.containers[empty_index].addChild(this.initItemIcon(item, empty_index));
			}else{
				throw "Not enough space";
			}
		}
	}else{
		var empty_index = this.getEmptySlot();
		if(empty_index >= 0){
			this.containers[empty_index].addChild(this.initItemIcon(item, empty_index));
		}else{
			throw "Not enough space";
		}
	}
	this.saveInventory();
	if(this.stage){
		this.stage.update();
	}
}

Inventory.prototype.updateQuantity = function(index){
	var item = this.containers[index].children[1].item;
	var qty = this.containers[index].children[1].children[2];
	qty.setText(item.qty);
	qty.x = 18 - qty.getMeasuredWidth();
	item.sell_price_text.text = item.sell_price * item.qty;
	item.sell_price_text.x = 126 - item.sell_price_text.getMeasuredWidth();
}

Inventory.prototype.initItemIcon = function(item, index){
	item.bin = this;
	item.index = parseInt(index);
	var container = new createjs.Container();
	container.item = item;
	container.cursor = "pointer";
	container.addEventListener("rollover", function(event){
		var index = container.parent.index;
		var x = (index % 15) * 20;
		var y = Math.floor(index / 15) * 20;
		item.showDetail(x > 160 ? x - 115 : 5 + x, 400 + y - item.summary_height, this.stage);
		this.stage.update();
	}.bind(this));

	container.addEventListener("rollout", function(event){
		if(this.stage){
			this.stage.removeChild(item.detail);
			this.stage.update();			
		}
	}.bind(this));

	var border = new createjs.Shape();
	border.graphics.s("#000").ss(1).f(item.colors[item.rating-1]).dr(0,0,20,20);

	var icon = item.icon_img.clone();
	icon.x = icon.y = 10;
	container.addChild(border, icon);

	if(item.type === "consumable"){
		var qty = new OutlineText(item.qty,"bold 8px Arial","#fff","#000",2);
		qty.x = 18 - qty.getMeasuredWidth();
		qty.y = 12;
		container.addChild(qty);
	}

	return container;
}

Inventory.prototype.renderPortrait = function(){
	this.units_container.removeAllChildren();
	var units = [];
	units.push(this.user.hero);
	units = units.concat(this.user.followers);
	units.forEach(function(unit, index){
		var container = new createjs.Container();
		var portrait = unit.getPortrait();
		var border = new createjs.Shape();
		border.graphics.s("#000").f(unit.getClassColor()).dr(0,0,50,50);
		portrait.scaleX = portrait.scaleY = 0.5;
		portrait.x = portrait.y = 1;
		container.x = 50 * parseInt(index % 6);
		container.y = 50 * parseInt(index / 6);
		container.cursor = "pointer";
		container.addEventListener("mousedown", this.mouseDownOnPortrait.bind(this, unit, container));
		container.addChild(border, portrait);
		this.units_container.addChild(container);
	}, this);
	this.stage.update();
}

Inventory.prototype.mouseDownOnPortrait = function(unit, container){
	this.selectCharacterBorder.x = container.x + 6;
	this.selectCharacterBorder.y = container.y + 11;
	this.selectCharacterBorder.visible = true;
	this.selectCharacter(unit);
	this.unit_detail_container.visible = true;
}

Inventory.prototype.selectCharacter = function(unit){
	this.selectedCharacter = unit;
	this.displayStats(unit);
	this.displayEquipItems(unit);
	this.renderUnitDetail(unit);

	//this.equipableItems();
}

Inventory.prototype.equipableItems = function(){
	//console.log(this.equip_item_container.getChildByName("off_hand"));
	var shield, dual_wield, wand;
	shield = wand = dual_wield = false;
	this.selectedCharacter.passive_skills.forEach(function(skill){
		if(skill.name === "Defend"){
			shield = true;
		}else if(skill.name === "Dual Wield"){
			dual_wield = true;
		}else if(skill.name === "Wand Specialization"){
			wand = true;
		}
	}, this);

	this.containers.forEach(function(container){
		if(!shield && container.children.length > 1 && container.children[1].item.part === "shield"){
			console.log(container.children[1].item);
		}else if(!wand && container.children.length > 1 && (container.children[1].item.name === "Wand" || container.children[1].item.name === "Staff")){
			console.log(container.children[1].item);
		}
	});
}

Inventory.prototype.renderUnitDetail = function(unit){
	this.unit_sprite_container.removeAllChildren();
	var sprite = unit.getSprite();
	sprite.gotoAndPlay("stop");
	sprite._animation.speed = 0.3;
	sprite.scaleX = sprite.scaleY = 4;
	this.unit_sprite_container.addChild(sprite);
	this.stage.update();
}

// Inventory.prototype.sellItem = function(item){
// 	this.user.store.sellItem(item);
// 	this.user.addGold(item.sell_price * item.qty);
// 	$.post("sellitem", {sell_price:item.sell_price * item.qty}, function(res){
// 		console.log(res);
// 	});
// 	this.stage.update();
// }

Inventory.prototype.getEmptySlot = function(){
	var index = -1;
	for(var i = 0 ; i < this.capacity ; i++){
		if(this.containers[i].children.length === 1){
			index = i;
			break;
		}
	}
	return index;
}

Inventory.prototype.countEmptySpace = function(){
	var count = 0;
	for(var i = 0 ; i < this.capacity ; i++){
		if(this.containers[i].children.length === 1){
			count++;
		}
	}
	return count;
}

Inventory.prototype.haveAvailableSpace = function(item){
	var empty = false;
	for(var i = 0 ; i < this.capacity ; i++){
		if(this.containers[i].children.length === 1 || this.containers[i].children[1].item.constructor.name === "Consumable" && this.containers[i].children[1].item.name === item.name){
			empty = true;
			break;
		}
	}
	return empty;
}

Inventory.prototype.findItem = function(item){
	var index = -1;
	for(var i = 0 ; i < this.capacity ; i++){
		if(this.containers[i].children[1] && this.containers[i].children[1].item && this.containers[i].children[1].item.name === item.name){
			index = i;
			break;
		}
	}
	return index;
}

Inventory.prototype.saveInventory = function(){
	var items = [];

	this.containers.forEach(function(container){
		if(container.children.length > 1){
			var item = container.children[1].item;
			if(container.children[1].item.type === "weapon"){
				items.push({index:container.index, weapon:item._id});
			}else{
				items.push({index:container.index, armor:item._id});
			}
		}
	});
	console.log(items);
	$.post("saveinventory", {items:items}, function(res){
		if(res.err){
			console.log(res.err);
		}else{
			console.log(res);
		}
	});
}

Inventory.prototype.updateGold = function(gold){
	this.gold.setText(gold);
	this.gold.x = 310 - this.gold.getMeasuredWidth() - 22;
	if(this.stage){
		this.stage.update();
	}

}

Inventory.prototype.open = function(){
	this.isOpen = true;
	this.game.getRighttMenuStage().addChild(this);
	this.renderPortrait();
	this.stage.canvas.width = this.width;
	this.stage.canvas.height = this.height;
	if(this.selectedCharacter){
		this.selectCharacter(this.selectedCharacter);
	}
	this.stage.open();
}

Inventory.prototype.close = function(){
	if(this.isOpen){
		this.isOpen = false;
		this.stage.close();
	}
}
