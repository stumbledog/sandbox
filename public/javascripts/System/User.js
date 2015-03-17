function User(builder){
	this.id = builder._id;
	this.gold = builder.gold;
	this.created_at = builder.created_at;
	this.last_logged_in = builder.last_logged_in;
	this.inventory = new Inventory(builder.inventory);
}

User.prototype.purchase = function(item){
	this.gold -= item.price;
	this.inventory.addItem(item);
}

User.prototype.save = function(){

}