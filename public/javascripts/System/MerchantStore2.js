function MerchantStore(items){
	//this.categoies = ["Weapons", "Armors", "Consumables", "Repurchase"];
	this.weaponContainer = new createjs.Container();
	this.armorContainer = new createjs.Container();
	this.consumableContainer = new createjs.Container();
	this.repurchaseContainer = new createjs.Container();
	this.initialize(items);
}

MerchantStore.prototype.initialize = function(items){
	items.forEach(function(item){
		switch(item.type){
			case "weapon":
				this.initWeaponItem(item);
			break;
			case "armor":
				this.initArmorItem(item);
			break;
			case "consumable":
				this.initConsumableItem(item);
			break;
		}
	}, this);
}

MerchantStore.prototype.initWeaponItem = function(item){
	var weapon = new Weapon(item);
	weapon.
}

MerchantStore.prototype.initArmorItem = function(item){

}

MerchantStore.prototype.initConsumableItem = function(item){

}

MerchantStore.prototype.initRepurchaseItem = function(item){

}

MerchantStore.prototype.open = function(user){
	this.user = user;
	//todo render store
}

MerchantStore.prototype.itemSummary = function(item, repurchase){

	var frame = new createjs.Shape();
	frame.graphics.s("#000").ss(1).f("#fff").dr(0,0,100,60).dr(0,0,30,60).dr(30,45,70,15).f(item.colors[item.rating-1]).dr(0,0,30,60);

	var icon = item.icon.clone();
	icon.x = 15;
	icon.y = 30;

	var name = new createjs.Text(item.name, "12px Arial","#000");
	name.x = 32;
	name.y = 2;

	if(repurchase){
		var price = new createjs.Text(item.sell_price, "12px Arial","#000");
	}else{
		var price = new createjs.Text(item.price, "12px Arial","#000");
	}

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