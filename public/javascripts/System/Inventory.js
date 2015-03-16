function Inventory(builder){
	console.log(builder);
	this.capacity = builder.capacity;
	this.slots = builder.slots;
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