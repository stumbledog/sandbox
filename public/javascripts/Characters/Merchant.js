function Merchant(builder){
	this.merchant_initialize(builder);
}

Merchant.prototype = new NPC();
Merchant.prototype.constructor = Merchant;

Merchant.prototype.merchant_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new Store(builder.type);
}

Merchant.prototype.interact = function(hero){
	console.log(hero);
	this.store.open();
}