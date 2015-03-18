function Inventory(builder){
	this.initialize(builder);
}

Inventory.prototype = new createjs.Container();
Inventory.prototype.constructor = Inventory;
Inventory.prototype.container_initialize = Inventory.prototype.initialize;

Inventory.prototype.initialize = function(builder){
	this.container_initialize();
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.width = 310;
	this.height = 400;

	this.container = new createjs.Container();
	this.stage = new createjs.Stage();
	this.capacity = builder.capacity;
	this.slots = [];
	builder.slots.forEach(function(item){
		switch(item.type){
			case "weapon":
				this.slots.push(new Weapon(item));
			break;
			case "armor":
				this.slots.push(new Armor(item));
			break;
			case "consumable":
				this.slots.push(new Consumable(item));
			break;
		}
	}, this);
	console.log(this.slots);
}

Inventory.prototype.haveAvailableSpace = function(){
	return (this.capacity - this.slots.length) > 0;
}

Inventory.prototype.addItem = function(item){
	if(item.constructor.name === "Consumable"){
		var find = false;
		this.slots.forEach(function(slot_item){
			if(slot_item.name === item.name){
				slot_item.qty++;
				find = true;
				return false;
			}
		});
		if(!find){
			item.qty = 1;
			this.slots.push(item);
		}
	}else{
		this.slots.push(item);
	}
	console.log(this.slots);
}

Inventory.prototype.open = function(){

}