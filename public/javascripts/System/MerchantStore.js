function MerchantStore(items){
	this.merchantstore_initialize(items);
}

MerchantStore.prototype = Object.create(Store.prototype);
MerchantStore.prototype.constructor = MerchantStore;

MerchantStore.prototype.merchantstore_initialize = function(items){
	this.store_initialize(items);
	this.setCategory();
	this.setItems();

	this.item_detail = new createjs.Container();
	this.item_detail_bg = new createjs.Shape();
	this.item_detail_bg.graphics.f("#fff").dr(0,0,120,60);
	this.item_detail.addChild(this.item_detail_bg);
	//this.addChild(this.item_detail);
}

MerchantStore.prototype.setCategory = function(){
	this.categories = {
		weapons:{
			container:new createjs.Container(),
			items:[],
		},
		armors:{
			container:new createjs.Container(),
			items:[],
		},
		consumables:{
			container:new createjs.Container(),
			items:[],
		},
	};

	this.current_category = this.categories.weapon;

	this.item_category_button_container = new createjs.Container();

	this.item_category_button_container.x = this.item_category_button_container.y = 10;

	var offsetX = 0;
	var icons = {
		weapons:[292,100,16,16],
		armors:[244,149,16,16],
		consumables:[103,76,12,16],
	};
	Object.keys(this.categories).forEach(function(key){
		var container = new createjs.Container();
		var icon = new createjs.Bitmap(this.loader.getResult("icon"));
		icon.sourceRect = new createjs.Rectangle(icons[key][0],icons[key][1],icons[key][2],icons[key][3]);

		var border = new createjs.Shape();
		var text = new createjs.Text(key, "16px Arial", "#fff");
		text.x = 18;

		border.graphics.f("#000").dr(0,0,text.getMeasuredWidth(),text.getMeasuredHeight());
		container.addChild(border, icon, text);

		container.x = offsetX;
		this.item_category_button_container.addChild(container);
		offsetX += text.getMeasuredWidth() + 20;
	}, this);
	this.addChild(this.item_category_button_container);
}

MerchantStore.prototype.setItems = function(){
	this.items.forEach(function(item){
		switch(item.type){
			case "weapon":
				this.categories.weapons.items.push(item);
			break;
			case "armor":
				this.categories.armors.items.push(item);
			break;
			case "consumable":
				this.categories.consumables.items.push(item);
			break;
		}
	}, this);

	Object.keys(this.categories).forEach(function(key){
		var category = this.categories[key];
		category.items.forEach(function(item, index){
			var item_shape = new createjs.Bitmap(this.loader.getResult(item.icon.source.split('/').pop()));
			item_shape.sourceRect = new createjs.Rectangle(item.icon.cropX, item.icon.cropY, item.icon.width, item.icon.height);
			item_shape.x = (index + 1) * 20;
			item_shape.y = parseInt(index / 5 + 1) * 20;
			item_shape.cursor = "pointer";

			item_shape.addEventListener("rollover", function(event){
				this.item_detail.x = event.target.x + 8;
				this.item_detail.y = event.target.y + 8;
				this.addChild(this.item_detail);
				this.menu_stage.update();
			}.bind(this));

			item_shape.addEventListener("rollout", function(event){
				this.removeChild(this.item_detail);
				this.menu_stage.update();
			}.bind(this));

			category.container.addChild(item_shape);
		}, this);
	}, this)
/*
	this.item_container = new createjs.Container();
	this.items.forEach(function(item, index){
		var item_shape = new createjs.Bitmap(this.loader.getResult(item.icon.source.split('/').pop()));
		item_shape.sourceRect = new createjs.Rectangle(item.icon.cropX, item.icon.cropY, item.icon.width, item.icon.height);
		item_shape.x = (index + 1) * 20;
		item_shape.y = parseInt(index / 5 + 1) * 20;
		item_shape.cursor = "pointer";

		item_shape.addEventListener("rollover", function(event){
			this.item_detail.x = event.target.x + 8;
			this.item_detail.y = event.target.y + 8;
			this.addChild(this.item_detail);
			this.menu_stage.update();
		}.bind(this));

		item_shape.addEventListener("rollout", function(event){
			this.removeChild(this.item_detail);
			this.menu_stage.update();
		}.bind(this));

		this.item_container.addChild(item_shape);
	}, this);
	this.addChild(this.item_container);*/
}

MerchantStore.prototype.open = function(){
	this.resize();
	this.menu_stage.addMenu(this);
}