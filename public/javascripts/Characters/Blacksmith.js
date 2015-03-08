function Blacksmith(builder){
	this.blacksmith_initialize(builder);
}

Blacksmith.prototype = Object.create(NPC.prototype);
Blacksmith.prototype.constructor = Blacksmith;

Blacksmith.prototype.blacksmith_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new Store();
}

Blacksmith.prototype.interact = function(){
	console.log(hero);

}