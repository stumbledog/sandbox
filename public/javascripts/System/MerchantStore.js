function MerchantStore(items){
	this.merchantstore_initialize(items);
}

MerchantStore.prototype = Object.create(Store.prototype);
MerchantStore.prototype.constructor = MerchantStore;

MerchantStore.prototype.merchantstore_initialize = function(items){
	this.store_initialize(items);
	this.setItems();
	this.item_detail = new createjs.Container();
	this.item_detail_bg = new createjs.Shape();
	this.item_detail_bg.graphics.f("#fff").dr(0,0,120,60);
	this.item_detail.addChild(this.item_detail_bg);
	this.addChild(this.item_detail);
}

MerchantStore.prototype.setItems = function(){
	this.item_container = new createjs.Container();
	this.items.forEach(function(item, index){
		var item_shape = new createjs.Bitmap(this.loader.getResult(item.icon.source.split('/').pop()));
		item_shape.sourceRect = new createjs.Rectangle(item.icon.cropX, item.icon.cropY, item.icon.width, item.icon.height);
		item_shape.x = (index + 1) * 20;
		item_shape.y = parseInt(index / 5 + 1) * 20;
		item_shape.cursor = "pointer";

		item_shape.addEventListener("rollover", function(event){
			
		});

		this.item_container.addChild(item_shape);
	}, this);
	this.addChild(this.item_container);
}

MerchantStore.prototype.open = function(){
	this.resize();
	this.menu_stage.addMenu(this);
}