function User(builder){
	this.id = builder._id;
	this.gold = builder.gold;
	this.created_at = builder.created_at;
	this.last_logged_in = builder.last_logged_in;
	this.isShopping = false;
	this.store = null;
	this.inventory = new Inventory(builder.inventory, this);
}

User.prototype.purchase = function(item){
	this.gold -= item.price;
	this.inventory.addItem(item);
}

User.prototype.save = function(){
	
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