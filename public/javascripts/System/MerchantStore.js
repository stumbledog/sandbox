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
/*	this.item_detail_bg = new createjs.Shape();
	this.item_detail_bg.graphics.f("#fff").dr(0,0,120,60);
	this.item_detail.addChild(this.item_detail_bg);
	this.item_list = new createjs.Container();*/

	this.current_key = "weapons";
	this.previous_key = null;
	this.selectCategory.call(this, "weapons");
	this.render();
}

MerchantStore.prototype.render = function(){
	Store.prototype.render.call(this);
	//console.log(this.item_category_button_container.children);
}

MerchantStore.prototype.selectCategory = function(key){
	this.previous_key = this.current_key;
	this.current_key = key;

	if(this.previous_key){
		this.categories[this.previous_key].category_container.children[0].graphics._fill.style = "#FFF";
	}
	this.categories[key].category_container.children[0].graphics._fill.style = "#FF6138";

	console.log(this.categories[key].items);

	this.item_container.removeAllChildren();
	var colors = ["#ccc","#5C832F","#FFD34E"];
	this.categories[key].items.forEach(function(item, index){
		/*
		var border = new createjs.Shape();
		border.graphics.s("#000").ss(1).f("#fff").dr(0,0,100,60).dr(0,0,30,60).dr(30,45,70,15).f(colors[item.rating-1]).dr(0,0,30,60);

		var icon = new createjs.Bitmap(this.loader.getResult(item.icon.source.split('/').pop()));
		icon.sourceRect = new createjs.Rectangle(item.icon.cropX, item.icon.cropY, item.icon.width, item.icon.height);
		icon.regX = item.icon.width / 2;
		icon.regY = item.icon.height / 2;
		icon.x = 15;
		icon.y = 30;

		var name = new createjs.Text(item.name, "12px Arial","#000");
		name.x = 32;
		name.y = 2;

		var price = new createjs.Text(item.price, "12px Arial","#000");
		price.x = 32;
		price.y = 46;

		var coin = new createjs.Bitmap(this.loader.getResult("icon"));
		coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
		coin.x = 33 + price.getMeasuredWidth();
		coin.y = 48;
		coin.scaleX = coin.scaleY = 0.8;

		var container = new createjs.Container();
		container.addChild(border, icon, name, price, coin);
		container.x = index % 3 * 100;
		container.y = parseInt(index / 3) * 60;
		container.cursor = "pointer";
		item.x = container.x;
		item.y = container.y;
		container.addEventListener("rollover", this.mouseOverItem.bind(this, item));
		container.addEventListener("rollout", this.mouseOutItem.bind(this, item));
		this.item_container.addChild(container);
		*/
		item.store_summary.x = index % 3 * 100;
		item.store_summary.y = parseInt(index / 3) * 60;
		item.store_summary.cursor = "pointer";
		this.item_container.addChild(item.store_summary);
	}, this);

	this.menu_stage.update();
}

MerchantStore.prototype.mouseOverItem = function(item){
	/*
	var colors = ["#ccc","#5C832F","#FFD34E"];
	var ratings = ["Common", "Magic", "Rare", "Epic", "Legendary"];
	var rating_text = new createjs.Text(ratings[item.rating - 1] + " Weapon", "bold 10px Arial", colors[item.rating - 1]);
	var name_text = new createjs.Text(item.name.replace("\n", " "), "10px Arial", "#000");
	var hand_text = new createjs.Text(item.hand+"-hand", "10px Arial", "#000");	
	var damage_text = new createjs.Text("", "bold 16px Arial", "#C00");
	var attack_speed_text = new createjs.Text("", "10px Arial", "#000");
	var dps_text = new createjs.Text("", "10px Arial", "#000");
	var level_text = new createjs.Text("Item Level: " + item.level, "10px Arial", "#000");

	level_text.x = dps_text.x = attack_speed_text.x = damage_text.x = name_text.x = rating_text.x = rating_text.y = 2;
	hand_text.x = 120 - hand_text.getMeasuredWidth() - 2;
	name_text.y = hand_text.y = 14;
	damage_text.y = 28;
	attack_speed_text.y = 48;
	dps_text.y = 62;
	level_text.y = 76 + 14 * item.rating

	var min_damage = item.min_damage;
	var max_damage = item.max_damage;

	if(item.min_damage_bonus && item.max_damage_bonus){
		min_damage += item.min_damage_bonus;
		max_damage += item.max_damage_bonus;
	}

	damage_text.text = min_damage + " ~ " + max_damage;

	if(item.attack_speed_bonus){
		var attack_speed = (60 / (item.attack_speed * (100 - item.attack_speed_bonus) / 100)).toFixed(1);
	}else{
		var attack_speed = (60 / item.attack_speed).toFixed(1);
	}

	attack_speed_text.text = attack_speed + " Attacks Per Sec";

	var dps = ((min_damage + max_damage) * attack_speed / 2).toFixed(1);
	dps_text.text = dps + " DPS";

	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 120, 90 + 14 * item.rating);

	if(item.x !== 200){
		this.item_detail.x = item.x;
	}else{
		this.item_detail.x = 180;
	}
	if(item.y > 120){
		this.item_detail.y = item.y - (90 + 14 * item.rating);
	}else{
		this.item_detail.y = item.y + 60;
	}	
	this.item_detail.addChild(bg, rating_text, name_text, hand_text, damage_text, attack_speed_text, dps_text, level_text);

	item.attributes.forEach(function(attribute, index){
		var attr_text = new createjs.Text("","10px Arial","#B64926");
		switch(attribute){
			case 0:
				attr_text.text = "+" + item.min_damage_bonus + " ~ " + item.max_damage_bonus + " Damage";
			break;
			case 1:
				attr_text.text = "+" + item.attack_speed_bonus + "% Attack speed";
			break;
			case 2:
				if(item.strength){
					attr_text.text = "+" + item.strength + " Strength";
				}else if(item.agility){
					attr_text.text = "+" + item.agility + " Agility";
				}else{
					attr_text.text = "+" + item.intelligence + " Intelligence";
				}
			break;
			case 3:
				attr_text.text = "+" + item.critical_rate + "% Critical rate";
			break;
			case 4:
				attr_text.text = "+" + item.critical_damage + "% Critical damage";
			break;
			case 5:
				attr_text.text = "+" + item.life_steal + "% Life Steal";
			break;
		}
		attr_text.x = 2;
		attr_text.y = 76 + 14 * index;
		this.item_detail.addChild(attr_text);
	}, this);


	this.item_container.addChild(this.item_detail);
	this.menu_stage.update();
	*/
}

MerchantStore.prototype.mouseOutItem = function(item){
	this.item_detail.removeAllChildren();
	this.item_container.removeChild(this.item_detail);
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
				this.categories.weapons.items.push(new Weapon(item, this.item_container));
				//this.categories.weapons.items.push(item);
			break;
			case "armor":
				this.categories.armors.items.push(item);
			break;
			case "consumable":
				this.categories.consumables.items.push(item);
			break;
		}
	}, this);
	/*
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

			category.item_container.addChild(item_shape);
		}, this);
	}, this);*/
}