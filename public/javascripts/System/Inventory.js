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

	this.initFrame();
	this.initEquipItemContainers();
	this.initStatsContainer();
	this.initItemContainers();
	this.initInventoryItem(builder.slots);
}

Inventory.prototype.initFrame = function(){
	var frame = new createjs.Shape();
	frame.graphics.s("#000").f("#E6E2AF").dr(5,10,300,530);

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
	this.unit_detail_container.y = 250;
	this.unit_detail_container.visible = false;;

	this.unit_sprite_container = new createjs.Container();
	this.unit_sprite_container.x = 240;
	this.unit_sprite_container.y = 64;

	this.close_button = new createjs.Container();
	this.close_button.x = 270;
	this.close_button.cursor = "pointer";
	this.close_button.addEventListener("mousedown", function(){
		this.unit_detail_container.visible = false;
	}.bind(this));

	this.close_button_bg = new createjs.Shape();
	this.close_button_bg.graphics.s("#000").f("#8E2800").dr(0,0,20,20);

	this.close_icon = new createjs.Shape();
	this.close_icon.graphics.s("#FFF0A5").ss(3).mt(5,5).lt(15,15).mt(5,15).lt(15,5);
	this.close_button.addChild(this.close_button_bg, this.close_icon);

	this.unit_detail_container.addChild(this.unit_sprite_container, this.close_button);
	this.addChild(frame, this.gold, this.coin, this.units_container, this.unit_detail_container);
}

Inventory.prototype.initStatsContainer = function(){
	//strength, agility, intelligence, stamina, damage, attack_speed, movement_speed, armor, avoidance, crit_rate, crit_damage
	//life_steal, cooldown reduction, health regen, resource regen, 
	//dps	
	this.stats_container = new createjs.Container();
	this.initStats("Strength", 10, 10);
	this.initStats("Agility", 10, 20);
	this.initStats("Intelligence", 10, 30);
	this.initStats("Stamina", 10, 40);
	this.initStats("Damage", 10, 50);
	this.initStats("Att. Speed", 10, 60);
	this.initStats("Armor", 10, 70);
	this.initStats("Avoidance", 10, 80);
	this.initStats("Move. Speed", 10, 90);
	this.initStats("Move. Speed", 10, 100);
	this.initStats("Move. Speed", 10, 110);
	this.initStats("Move. Speed", 10, 120);
	this.unit_detail_container.addChild(this.stats_container);
}

Inventory.prototype.initStats = function(text, x, y){
	var text = new createjs.Text(text, "bold Arial 9px", "#000");
	text.x = x;
	text.y = y;
	this.stats_container.addChild(text);
}

Inventory.prototype.initEquipItemContainers = function(){
	this.equip_item_container = new createjs.Container();
	this.initEquipItemContainer("head", 230, 40, 244, 149, 16, 15);
	this.initEquipItemContainer("necklace", 210, 50, 148, 173, 16, 15);
	this.initEquipItemContainer("chest", 230, 60, 316, 125, 16, 15);
	this.initEquipItemContainer("grove", 190, 70, 99, 126, 15, 15);
	this.initEquipItemContainer("belt", 230, 80, 340, 150, 16, 15);
	this.initEquipItemContainer("boots", 230, 100, 173, 173, 15, 16);
	this.initEquipItemContainer("cape", 250, 50, 4, 173, 16, 16);
	this.initEquipItemContainer("left_ring", 250, 80, 78, 176, 12, 12);
	this.initEquipItemContainer("right_ring", 210, 80, 78, 176, 12, 12);
	this.initEquipItemContainer("left_hand_weapon", 270, 90, 198, 149, 13, 16);
	this.initEquipItemContainer("right_hand_weapon", 190, 90, 245, 103, 13, 14);
	this.unit_detail_container.addChild(this.equip_item_container);
}

Inventory.prototype.initEquipItemContainer = function(part, x, y, cropX, cropY, width, height){
	var container = new createjs.Container();
	container.x = x;
	container.y = y;
	container.alpha = 0.7;

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
		container.x = (i % 15) * 20 + 5;
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
					if(this.user.isShopping){
						this.sellItem(event.currentTarget.children[1].item);
						event.currentTarget.removeChildAt(1);
					}else{
						//equip item
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
		}
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
			this.containers[empty_index].addChild(this.initItemIcon(item, empty_index));
		}
	}else{
		var empty_index = this.getEmptySlot();
		this.containers[empty_index].addChild(this.initItemIcon(item, empty_index));
	}
	this.stage.update();
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
		this.stage.removeChild(item.detail);
		this.stage.update();
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
		container.addEventListener("mousedown", this.mouseDownOnPortrait.bind(this, unit));
		container.addChild(border, portrait);
		this.units_container.addChild(container);
	}, this);
	this.stage.update();
}

Inventory.prototype.mouseDownOnPortrait = function(unit){
	this.selectCharacter(unit);
	this.unit_detail_container.visible = true;
}

Inventory.prototype.selectCharacter = function(unit){
	this.renderUnitDetail(unit);
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

Inventory.prototype.open = function(){
	this.isOpen = true;
	this.game.getRighttMenuStage().addChild(this);
	this.renderPortrait();
	this.stage.open();
}

Inventory.prototype.close = function(){
	if(this.isOpen){
		this.isOpen = false;
		this.stage.close();
	}
}

Inventory.prototype.equipItem = function(item){
	this.selectedCharacter.equipItem(Item);
	this.removeItem(item);
}

Inventory.prototype.sellItem = function(item){
	this.user.store.sellItem(item);
	this.user.addGold(item.sell_price * item.qty);
	$.post("sellitem", {item_id:item._id}, function(res){
		console.log(res);
	});
	this.stage.update();
}

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
			items.push(container.children[1].item.toObject());
		}
	});

	$.post("saveinventory", {items:items}, function(res){
		console.log(res);
	});
}

Inventory.prototype.updateGold = function(gold){
	this.gold.setText(gold);
	this.gold.x = 310 - this.gold.getMeasuredWidth() - 22;
	this.stage.update();
}