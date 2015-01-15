function Character(){
	this.initialize();
}

Character.prototype = new createjs.Shape();

Character.prototype.initialize = function(){
	console.log("initialized");
}