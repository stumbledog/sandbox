function Store(items){
	this.store_initialize(items);
}

Store.prototype = new createjs.Container();
Store.prototype.constructor = Store;
Store.prototype.container_initialize = Store.prototype.initialize;

Store.prototype.store_initialize = function(items){
	this.container_initialize();
	this.game = Game.getInstance();
	this.loader = this.game.getLoader();
	this.menu_stage = this.game.getMenuStage();
	this.items = items;

	this.border = new createjs.Shape();
	this.shape = new createjs.Shape();

	this.render();
}

Store.prototype.render = function(){
	this.border.graphics.f("#D9CB9E").dr(0, 0, this.menu_stage.canvas.width / 2, this.menu_stage.canvas.height);
	this.shape.graphics.f("#1E1E20").dr(5, 5, this.menu_stage.canvas.width / 2 - 10, this.menu_stage.canvas.height - 10);
	this.addChild(this.border, this.shape, this.item_container);
}

Store.prototype.open = function(){
	console.log(this.items);
}

Store.prototype.purchase = function(item){
	
}

Store.prototype.refund = function(item){
	
}

Store.prototype.recruitUnit = function(unit){

}

Store.prototype.resize = function(){
	this.border.graphics.c().f("#D9CB9E").dr(0, 0, this.menu_stage.canvas.width / 2, this.menu_stage.canvas.height);
	this.shape.graphics.c().f("#1E1E20").dr(5, 5, this.menu_stage.canvas.width / 2 - 10, this.menu_stage.canvas.height - 10);	
}