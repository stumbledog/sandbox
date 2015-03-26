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

	this.item_container = new createjs.Container();
	this.item_container_frame = new createjs.Shape();
	var item_container_frame_graphics = this.item_container_frame.graphics;
	var rows = this.capacity / 15;
	item_container_frame_graphics.s("#000").f("#fff").dr(0,0,300,rows*20);
	for(var i = 0 ; i < rows ; i++){
		item_container_frame_graphics.mt(0,(i+1)*20).lt(300,(i+1)*20)
		.mt(20,i*20).lt(20,(i+1)*20)
		.mt(40,i*20).lt(40,(i+1)*20)
		.mt(60,i*20).lt(60,(i+1)*20)
		.mt(80,i*20).lt(80,(i+1)*20)
		.mt(100,i*20).lt(100,(i+1)*20)
		.mt(120,i*20).lt(120,(i+1)*20)
		.mt(140,i*20).lt(140,(i+1)*20)
		.mt(160,i*20).lt(160,(i+1)*20)
		.mt(180,i*20).lt(180,(i+1)*20)
		.mt(200,i*20).lt(200,(i+1)*20)
		.mt(220,i*20).lt(220,(i+1)*20)
		.mt(240,i*20).lt(240,(i+1)*20)
		.mt(260,i*20).lt(260,(i+1)*20)
		.mt(280,i*20).lt(280,(i+1)*20);
	}

	this.item_container.x = this.item_container_frame.x = 5;
	this.item_container.y = this.item_container_frame.y = 400;

	this.slots = [];
	builder.slots.forEach(function(item){
		switch(item.type){
			case "weapon":
				var weapon = new Weapon(item);
				weapon.bin = this;
				this.slots.push(weapon);
			break;
			case "armor":
				var armor = new Armor(item);
				armor.bin = this;
				this.slots.push(armor);
			break;
			case "consumable":
				var consumable = new Consumable(item)
				consumable.bin = this;
				this.slots.push(consumable);
			break;
		}
	}, this);
	this.addChild(this.item_container_frame, this.item_container);
}

Inventory.prototype.haveAvailableSpace = function(item){
	if(item.constructor.name === "Consumable"){
		var find = false;
		this.slots.forEach(function(slot_item){
			if(slot_item.name === item.name){
				find = true;
				return false;
			}
		});
		return find || (this.capacity - this.slots.length) > 0;
	}else{
		return (this.capacity - this.slots.length) > 0;
	}
}

Inventory.prototype.addItem = function(item){
	if(item.constructor.name === "Consumable"){
		var find = false;
		this.slots.forEach(function(slot_item, index){
			if(slot_item.name === item.name){
				slot_item.qty++;
				find = true;
				this.updateQuantity(index);
				return false;
			}
		}, this);
		if(!find){
			item.qty = 1;
			item.bin = this;
			this.item_container.addChild(this.initItemIcon(item, this.slots.length));
			this.slots.push(item);
		}
	}else{
		item.bin = this;
		this.item_container.addChild(this.initItemIcon(item, this.slots.length));
		this.slots.push(item);
	}

	this.stage.update();
}

Inventory.prototype.updateQuantity = function(index){
	var item = this.slots[index];
	var qty = this.item_container.children[index].children[2];
	qty.setText(item.qty);
	qty.x = 18 - qty.getMeasuredWidth();
	item.sell_price_text.text = item.sell_price * item.qty;
	item.sell_price_text.x = 126 - item.sell_price_text.getMeasuredWidth();
}

Inventory.prototype.initItemIcon = function(item, index){
	var container = new createjs.Container();
	container.x = (index % 15) * 20;
	container.y = Math.floor(index / 15) * 20;
	container.cursor = "pointer";
	container.addEventListener("rollover", function(event){
		item.showDetail(container.x > 160 ? container.x - 115 : 5 + container.x, 400 + container.y - item.summary_height, this.stage);
		this.stage.update();
	}.bind(this));

	container.addEventListener("rollout", function(event){
		this.stage.removeChild(item.detail);
		this.stage.update();
	}.bind(this));

	container.addEventListener("mousedown", function(event){
		console.log(item);
		if(event.nativeEvent.button === 2){
			if(this.user.isShopping){
				this.sellItem(item);
				// sell Item
			}else{
				//equip item
			}
		}
		console.log(this.user.isShopping);
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
	this.item_container.addChild(container);
}

Inventory.prototype.displayGold = function(){
	
}

Inventory.prototype.open = function(){
	this.isOpen = true;
	this.item_container.removeAllChildren();
	this.game.getRighttMenuStage().addChild(this);
	this.slots.forEach(function(item, index){
		this.item_container.addChild(this.initItemIcon(item, index));
	}, this);
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
	var index = this.slots.indexOf(item);
	if (index > -1) {
		this.slots.splice(index, 1);
	}	
	this.item_container.removeChildAt(index);
	this.user.addGold(item.sell_price);
	this.stage.update();
}