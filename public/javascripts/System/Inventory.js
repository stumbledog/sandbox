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
			if(event.nativeEvent.button === 0 && event.currentTarget.children.length && this.drag_item){
				event.currentTarget.addChild(this.drag_item);
				this.drag_item = null;
			}
		}.bind(this));
	}

	builder.slots.forEach(function(item){
		var index = this.getEmptySlot();
		switch(item.type){
			case "weapon":
				var weapon = new Weapon(item);
				this.containers[index].addChild(this.initItemIcon(weapon, index));
			break;
			case "armor":
				var armor = new Armor(item);
				this.containers[index].addChild(this.initItemIcon(armor, index));
			break;
			case "consumable":
				var consumable = new Consumable(item);
				this.containers[index].addChild(this.initItemIcon(consumable, index));
			break;
		}
	}, this);
}

Inventory.prototype.addItem = function(item){
	if(item.constructor.name === "Consumable"){
		var find = false;
		var index = this.findItem(item);
		if(index > -1){
			this.containers[index].children[0].item.qty++;
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
	var item = this.containers[index].children[0].item;
	var qty = this.containers[index].children[0].children[2];
	qty.setText(item.qty);
	qty.x = 18 - qty.getMeasuredWidth();
	item.sell_price_text.text = item.sell_price * item.qty;
	item.sell_price_text.x = 126 - item.sell_price_text.getMeasuredWidth();
}

Inventory.prototype.initItemIcon = function(item, index){
	item.bin = this;
	var x = (index % 15) * 20;
	var y = Math.floor(index / 15) * 20;
	var container = new createjs.Container();
	container.item = item;
	container.index = index;
	container.cursor = "pointer";
	container.addEventListener("rollover", function(event){
		item.showDetail(x > 160 ? x - 115 : 5 + x, 400 + y - item.summary_height, this.stage);
		this.stage.update();
	}.bind(this));

	container.addEventListener("rollout", function(event){
		this.stage.removeChild(item.detail);
		this.stage.update();
	}.bind(this));

	container.addEventListener("mousedown", function(event){
		console.log("item");
		if(event.nativeEvent.button === 0){
			if(!this.drag_item){
				this.drag_item = container;
				console.log(this.drag_item);
			}else{
				this.drag_item = null;
				console.log("swap item");
			}
		}else if(event.nativeEvent.button === 2){
			if(this.user.isShopping){
				container.parent.removeChild(container);
				this.sellItem(item);
				// sell Item
			}else{
				//equip item
			}
		}
	}.bind(this));

	var border = new createjs.Shape();
	border.graphics.s("#000").ss(1).f(item.colors[item.rating-1]).dr(0,0,20,20);

	var icon = item.icon.clone();
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

Inventory.prototype.moveItem = function(){

}

Inventory.prototype.swapItem = function(){

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
	this.user.store.sellItem(item);
	//var index = this.findItem(item);
	//this.containers[index].removeChildAt(1);
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