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
	//this.loader = this.game.getLoader();

	this.width = 310;
	this.height = 640;
	this.isOpen = false;
	this.capacity = builder.capacity;
	this.drag_item = null;
	this.containers = [];

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

						//this.saveInventory("swap_item", [swap_item.item.obj, this.drag_item.item.obj]);
						this.drag_item = null;
					}else{
						this.drag_item.item.index = event.currentTarget.index;
						event.currentTarget.addChild(this.drag_item);

						//this.saveInventory("move_item", this.drag_item.item.obj);
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
						// sell Item
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

	builder.slots.forEach(function(item){
		item.index = parseInt(item.index);
		console.log(item);
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
			this.containers[index].children[1].item.qty++;
			this.updateQuantity(index);
		}else{
			item.qty = 1;
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

	if(item.qty){
		var qty = new OutlineText(item.qty,"bold 8px Arial","#fff","#000",2);
		qty.x = 18 - qty.getMeasuredWidth();
		qty.y = 12;
		container.addChild(qty);
	}

	return container;
}

Inventory.prototype.displayGold = function(){
	
}

Inventory.prototype.open = function(){
	this.isOpen = true;
	this.game.getRighttMenuStage().addChild(this);
	this.stage.open();
}

Inventory.prototype.close = function(){
	this.isOpen = false;
	this.stage.close();
}

Inventory.prototype.equipItem = function(item){
	this.selectedCharacter.equipItem(Item);
	this.removeItem(item);
}

Inventory.prototype.sellItem = function(item){
	$.post("sellitem", {item_id:item._id}, function(res){
		console.log(res);
	});
	this.user.store.sellItem(item);
	this.user.addGold(item.sell_price);
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