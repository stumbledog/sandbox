function Merchant(builder){
	this.merchant_initialize(builder);
}

Merchant.prototype = Object.create(NPC.prototype);
Merchant.prototype.constructor = Merchant;

Merchant.prototype.merchant_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new MerchantStore(this.game.getMerchantableItems());
}

Merchant.prototype.interact = function(hero){
	this.store.open();
}