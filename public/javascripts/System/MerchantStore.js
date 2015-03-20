function MerchantStore(items){
	this.merchantstore_initialize(items);
}

MerchantStore.prototype = Object.create(Store.prototype);
MerchantStore.prototype.constructor = MerchantStore;

MerchantStore.prototype.merchantstore_initialize = function(items){
	this.store_initialize(items);

	this.setCategory();
	this.setItems();

	this.current_key = "weapons";
	this.selectCategory("weapons");
	this.render();
}

MerchantStore.prototype.selectCategory = function(key){
	this.categories[this.current_key].category_container.children[0].graphics._fill.style = "#FFF";
	this.current_key = key;
	this.categories[this.current_key].category_container.children[0].graphics._fill.style = "#FF6138";

	this.item_container.removeAllChildren();
	var colors = ["#ccc","#5C832F","#FFD34E"];
	this.categories[key].items.forEach(function(item, index){
		item.store_summary.x = index % 3 * 100;
		item.store_summary.y = parseInt(index / 3) * 60;
		item.store_summary.cursor = "pointer";
		this.item_container.addChild(item.store_summary);
	}, this);

	if(this.stage){
		this.stage.update();
	}
}

MerchantStore.prototype.itemSummary = function(item){
	var frame = new createjs.Shape();
	frame.graphics.s("#000").ss(1).f("#fff").dr(0,0,100,60).dr(0,0,30,60).dr(30,45,70,15).f(item.colors[item.rating-1]).dr(0,0,30,60);

	var icon = item.icon.clone();
	icon.x = 15;
	icon.y = 30;

	var name = new createjs.Text(item.name, "12px Arial","#000");
	name.x = 32;
	name.y = 2;

	var price = new createjs.Text(item.price, "12px Arial","#000");
	price.x = 32;
	price.y = 46;

	var coin = new createjs.Bitmap(item.loader.getResult("icon"));
	coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
	coin.x = 33 + price.getMeasuredWidth();
	coin.y = 48;
	coin.scaleX = coin.scaleY = 0.8;

	item.store_summary = new createjs.Container();
	item.store_summary.addChild(frame, icon, name, price, coin);
	item.store_summary.cursor = "pointer";

	item.store_summary.addEventListener("rollover", this.rolloverStore.bind(this, item));
	item.store_summary.addEventListener("rollout", this.rolloutStore.bind(this, item));
	item.store_summary.addEventListener("mousedown", this.mousedownStoreItem.bind(this, item));
}

MerchantStore.prototype.rolloverStore = function(item){	
	if(item.store_summary.x !== 200){
		var x = item.store_summary.x + 5;
	}else{
		var x = 165;
	}
	if(item.store_summary.y > 120){
		var y = item.store_summary.y - (item.summary_height) + 50;
	}else{
		var y = item.store_summary.y + 110;
	}
	item.showDetail(x, y, this);
	this.stage.update();
}

MerchantStore.prototype.rolloutStore = function(item){
	this.removeChild(item.detail);
	this.stage.update();
}

MerchantStore.prototype.mousedownStoreItem = function(item, event){
	if(event.nativeEvent.button === 2){
		if(this.user.gold >= item.price && this.user.inventory.haveAvailableSpace(item)){
			$.post("purchaseitem", {item:item.obj}, function(res){
				console.log(res);
			});
			this.removeItem(item);
			this.purchase(item);
		}else{

		}
	}
}

MerchantStore.prototype.setCategory = function(){
	this.categories = {
		weapons:{
			category_container:new createjs.Container(),
			item_container:new createjs.Container(),
			items:[],
		},
		armors:{
			category_container:new createjs.Container(),
			item_container:new createjs.Container(),
			items:[],
		},
		consumables:{
			category_container:new createjs.Container(),
			item_container:new createjs.Container(),
			items:[],
		},
		repurchase:{
			category_container:new createjs.Container(),
			item_container:new createjs.Container(),
			items:[],
		},
	};

	this.current_category = this.categories.weapon;
	this.item_category_button_container = new createjs.Container();
	this.item_category_button_container.x = this.item_category_button_container.y = 10;

	var icons = {
		weapons:[292,100,16,16],
		armors:[244,149,16,16],
		consumables:[103,76,12,16],
		repurchase:[340,4,16,16],
	};

	Object.keys(this.categories).forEach(function(key, index){
		var category = this.categories[key];
		category.category_container.cursor = "pointer";
		category.category_container.x = index * 44;
		this.item_category_button_container.addChild(category.category_container);

		var icon = new createjs.Bitmap(this.loader.getResult("icon"));
		icon.sourceRect = new createjs.Rectangle(icons[key][0],icons[key][1],icons[key][2],icons[key][3]);
		icon.regX = icons[key][2]/2;
		icon.regY = icons[key][3]/2;
		icon.x = icon.y = 20;
		icon.scaleX = icon.scaleY = 2;

		var icon_box = new createjs.Shape();
		icon_box.graphics.s("#000").ss(1).f("#fff").dr(0,0,40,40);
		category.category_container.addChild(icon_box, icon);

		var text_container = new createjs.Container();
		var text_box = new createjs.Shape();
		var text = new createjs.Text(key, "16px Arial", "#000");
		text.x = text.y = 3;
		text_box.graphics.s("#000").ss(1).f("#fff").dr(0,0,text.getMeasuredWidth() + 6,text.getMeasuredHeight() + 6);
		text_container.addChild(text_box, text);

		category.category_container.addEventListener("mousedown", this.selectCategory.bind(this, key));
		category.category_container.addEventListener("rollover", function(){
			text_container.x = category.category_container.x + 41;
			this.item_category_button_container.addChild(text_container);
			this.stage.update();
		}.bind(this));
		category.category_container.addEventListener("rollout", function(){
			this.item_category_button_container.removeChild(text_container);
			this.stage.update();
		}.bind(this));

	}, this);
	this.addChild(this.item_category_button_container);
}

MerchantStore.prototype.setItems = function(){
	this.items.forEach(function(item){
		switch(item.type){
			case "weapon":
				var weapon = new Weapon(item);
				weapon.bin = this;
				this.categories.weapons.items.push(weapon);
				this.itemSummary(weapon);
			break;
			case "armor":
				var armor = new Armor(item);
				armor.bin = this;
				this.categories.armors.items.push(armor);
				this.itemSummary(armor);
			break;
			case "consumable":
				var consumable = new Consumable(item);
				consumable.bin = this;
				this.categories.consumables.items.push(consumable);
				this.itemSummary(consumable);
			break;
		}
	}, this);
}

MerchantStore.prototype.removeItem = function(item){
	switch(item.constructor.name){
		case "Weapon":
			var items = this.categories.weapons.items.filter(function(weapon){
				return weapon != item;
			});
			this.categories.weapons.items = items;
			this.selectCategory("weapons");
		break;
		case "Armor":
			var items = this.categories.armors.items.filter(function(armor){
				return armor != item;
			});
			this.categories.armors.items = items;
			this.selectCategory("armors");
		break;
		case "Consumable":
			// Do nothing for consumable items
		break;
	}
}

MerchantStore.prototype.open = function(){
	Store.prototype.open.call(this);
	this.user.openInventory();
}