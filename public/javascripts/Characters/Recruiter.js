function Recruiter(builder){
	this.recruiter_initialize(builder);
}

Recruiter.prototype = new NPC();
Recruiter.prototype.constructor = Recruiter;

Recruiter.prototype.recruiter_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new Store();
}

Recruiter.prototype.interact = function(){
	console.log(this.store);
}