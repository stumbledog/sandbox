function Battlemaster(builder){
	this.battlemaster_initialize(builder);
}

Battlemaster.prototype = new NPC();
Battlemaster.prototype.constructor = Battlemaster;

Battlemaster.prototype.battlemaster_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new Store();
}

Battlemaster.prototype.interact = function(){
	console.log(hero);

}