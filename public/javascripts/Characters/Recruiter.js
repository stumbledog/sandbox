function Recruiter(builder){
	this.recruiter_initialize(builder);
}

Recruiter.prototype = Object.create(NPC.prototype);
Recruiter.prototype.constructor = Recruiter;

Recruiter.prototype.recruiter_initialize = function(builder){
	this.npc_initialize(builder);
	this.store = new RecruiterStore(builder.recruitable_units);
}

Recruiter.prototype.interact = function(){
	console.log(this.store);
}