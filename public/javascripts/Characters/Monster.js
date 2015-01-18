function Monster(file, index){
	console.log("Monster instance");
	this.initialize(file, index);
}

Monster.prototype = Unit.prototype;
/*
Enemy.prototype.initialize = function(){
	console.log("init enemy");
}*/