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
	this.previous_key = null;
	this.selectCategory.call(this, "weapons");
	this.render();
}

MerchantStore.prototype.selectCategory = function(key){
	this.previous_key = this.current_key;
	this.current_key = key;

	if(this.previous_key){
		this.categories[this.previous_key].category_container.children[0].graphics._fill.style = "#FFF";
	}
	this.categories[key].category_container.children[0].graphics._fill.style = "#FF6138";

	this.item_container.removeAllChildren();
	var colors = ["#ccc","#5C832F","#FFD34E"];
	this.categories[key].items.forEach(function(item, index){
		item.store_summary.x = index % 3 * 100;
		item.store_summary.y = parseInt(index / 3) * 60;
		item.store_summary.cursor = "pointer";
		this.item_container.addChild(item.store_summary);
	}, this);

	this.menu_stage.update();
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
			this.menu_stage.update();
		}.bind(this));
		category.category_container.addEventListener("rollout", function(){
			this.item_category_button_container.removeChild(text_container);
			this.menu_stage.update();			
		}.bind(this));

	}, this);
	this.addChild(this.item_category_button_container);
}

MerchantStore.prototype.setItems = function(){
	this.items.forEach(function(item){
		switch(item.type){
			case "weapon":
				this.categories.weapons.items.push(new Weapon(item, this.item_container, this.menu_stage));
			break;
			case "armor":
				this.categories.armors.items.push(new Armor(item, this.item_container, this.menu_stage));
			break;
			case "consumable":
				this.categories.consumables.items.push(new Consumable(item, this.item_container, this.menu_stage));
			break;
		}
	}, this);
}