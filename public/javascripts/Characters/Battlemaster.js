function Battlemaster(builder){
	this.battlemaster_initialize(builder);
}

Battlemaster.prototype = Object.create(NPC.prototype);
Battlemaster.prototype.constructor = Battlemaster;

Battlemaster.prototype.battlemaster_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new Store();
}

Battlemaster.prototype.interact = function(){
	console.log(hero);

}