function Store(type){
	this.initialize(type);
}

Store.prototype = new createjs.Container();
Store.prototype.constructor = Store;
Store.prototype.container_initialize = Store.prototype.initialize;

Store.prototype.initialize = function(type){
	this.container_initialize();
	this.game = Game.getInstance();
	this.menu_stage = this.game.getMenuStage();
	this.type = type;

	this.render();
}

Store.prototype.render = function(){
	var shape = new createjs.Shape();
	shape.graphics.f("").dr(0,0,72,72);
	this.addChild(shape);
}

Store.prototype.open = function(){
	console.log(this.type + " is opened");
	this.menu_stage.addMenu(this);
}

Store.prototype.purchase = function(item){
	
}

Store.prototype.refund = function(item){
	
}

Store.prototype.recruitUnit = function(unit){

}