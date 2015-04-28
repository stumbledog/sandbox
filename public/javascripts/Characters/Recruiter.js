function Recruiter(builder, recruitable_units){
	this.recruiter_initialize(builder, recruitable_units);
}

Recruiter.prototype = Object.create(NPC.prototype);
Recruiter.prototype.constructor = Recruiter;

Recruiter.prototype.recruiter_initialize = function(builder, recruitable_units){
	this.npc_initialize(builder);
	this.store = new RecruiterStore(recruitable_units);
}

Recruiter.prototype.interact = function(){
	this.store.open();
}