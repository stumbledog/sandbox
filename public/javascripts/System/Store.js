function Store(){}

Store.prototype = new createjs.Container();
Store.prototype.constructor = Store;
Store.prototype.container_initialize = Store.prototype.initialize;

Store.prototype.initialize = function(builder){
	this.container_initialize();
	this.name = builder.name;
	this.type = builder.type;
}

Store.prototype.openStore = function(){
	
}

Store.prototype.purchase = function(item){
	
}

Store.prototype.refund = function(item){
	
}

Store.prototype.recruitUnit = function(unit){

}