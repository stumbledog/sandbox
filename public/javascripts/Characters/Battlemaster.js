function Battlemaster(builder){
	this.battlemaster_initialize(builder);
}

Battlemaster.prototype = Object.create(NPC.prototype);
Battlemaster.prototype.constructor = Battlemaster;

Battlemaster.prototype.battlemaster_initialize = function(builder){
	this.npc_initialize(builder);

	this.world_map = new WorldMap(builder.world_map);
}

Battlemaster.prototype.interact = function(){
	this.world_map.open();
}