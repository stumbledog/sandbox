function Armor(attributes){
	this.armor_initialize(attributes);
}

Armor.prototype = new Item();
Armor.prototype.constructor = Armor;

Armor.prototype.weapon_initialize = function(attributes){
	this.initialize(attributes);

}

Armor.prototype.rollover = function(){
	
}
