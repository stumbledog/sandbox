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

User.prototype.setHero = function(hero){
	this.hero = hero;
}


User.prototype.addFollower = function(follower){
	this.followers.push(follower);
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

User.prototype.purchaseFollower = function(follower, gold){
	this.gold -= gold;
	this.addFollower(follower);
	this.inventory.updateGold(this.gold);
	this.inventory.renderPortrait();
}

User.prototype.saveEquipItems = function(){
	var hero_items = [];
	var follower_items = [];
	this.hero.items.forEach(function(item, index){
		hero_items[index] = item.toObject();
	}, this);

	this.followers.forEach(function(follower, follower_index){
		follower_items[follower_index] = [];
		follower.items.forEach(function(item, item_index){
			follower_items[follower_index][item_index] = item.toObject();
		});
	});

	console.log(follower_items);

	$.post("saveequipitem",{hero_items:hero_items, follower_items:follower_items}, function(res){
		console.log(res);
	});

	this.inventory.saveInventory();
}