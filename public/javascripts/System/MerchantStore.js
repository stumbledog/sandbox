function MerchantStore(items){
	this.merchantstore_initialize(items);
}

MerchantStore.prototype = Object.create(Store.prototype);
MerchantStore.prototype.constructor = MerchantStore;

MerchantStore.prototype.merchantstore_initialize = function(items){
	this.store_initialize();
	this.items = items;
	console.log(this.items);
}

MerchantStore.prototype.open = function(){
	this.resize();
	this.menu_stage.addMenu(this);
}