function User(builder){
	this.id = builder._id;
	this.gold = builder.gold;
	this.created_at = builder.created_at;
	this.last_logged_in = builder.last_logged_in;
	this.isShopping = false;
	this.store = null;
	this.action = null;
	this.inventory = new Inventory(builder.inventory, this);
	this.followers = [];
}

User.prototype.purchase = function(item){
	if(item.repurchase){
		this.gold -= item.sell_price * item.qty;
	}else{
		this.gold -= item.price * item.qty;	
	}
	var purchased_item = jQuery.extend({}, item);
	this.inventory.addItem(purchased_item);
	this.inventory.updateGold(this.gold);

	return purchased_item;
}

User.prototype.openInventory = function(){
	this.inventory.open();
}

User.prototype.toggleInventory = function(){
	if(this.inventory.isOpen){
		this.inventory.close();
	}else{
		this.inventory.open();
	}
}

User.prototype.addGold = function(gold){
	this.gold += gold;
	this.inventory.updateGold(this.gold);
}

User.prototype.purchaseFollower = function(follower){
	//this.followers.push(follower);
}