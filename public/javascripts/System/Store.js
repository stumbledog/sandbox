function Store(items){
	this.store_initialize(items);
}

Store.prototype = new createjs.Container();
Store.prototype.constructor = Store;
Store.prototype.container_initialize = Store.prototype.initialize;

Store.prototype.store_initialize = function(items){
	this.container_initialize();
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.width = 310;
	this.height = 410;

	this.items = items;
	this.frame = new createjs.Shape();
	this.item_list_bg = new createjs.Shape();
	
	this.item_container = new createjs.Container();
	this.item_container.x = 5;
	this.item_container.y = 50;

	this.close_button = new createjs.Container();
	this.close_button.x = this.width - 35;
	this.close_button.y = 20;
	this.close_button.cursor = "pointer";
	this.close_button.addEventListener("mousedown", this.close.bind(this));

	this.close_button_bg = new createjs.Shape();
	this.close_button_bg.graphics.s("#000").ss(1).f("#8E2800").dr(0,0,30,30);

	this.close_icon = new createjs.Shape();
	this.close_icon.graphics.s("#FFF0A5").ss(3).mt(5,5).lt(25,25).mt(5,25).lt(25,5);

	this.close_button.addChild(this.close_button_bg, this.close_icon);
	this.addChild(this.frame, this.item_list_bg, this.item_container, this.close_button);
}

Store.prototype.render = function(){
	this.item_list_bg.graphics.c().s("#000").ss(1).f("#fff").dr(5, 50, this.width - 10, 360);
	this.close_button.x = this.width - 35;
}

Store.prototype.open = function(){
	this.game.getLeftMenuStage().addChild(this);
	this.stage.canvas.width = 310;
	this.stage.canvas.height = 410;
	this.stage.open();
}

Store.prototype.close = function(){
	this.stage.close();
}

Store.prototype.purchase = function(item){
	this.user.purchase(item);
}

Store.prototype.refund = function(item){
	
}

Store.prototype.recruitUnit = function(unit){

}

Store.prototype.resize = function(width, height){
	this.width = width;
	this.height = height;
	this.render();
}