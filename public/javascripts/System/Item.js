function Item(){

}

Item.prototype.initialize = function(attributes){
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.container = new createjs.Container();

	this.name = attributes.name;
	this.rating = attributes.rating;
	this.price = attributes.price;
	this.colors = ["#ccc","#5C832F","#FFD34E"];

	this.initIcon(attributes.icon);
	this.initDetail();

	this.obj = attributes;
}

Item.prototype.initIcon = function(attributes){
	this.icon = new createjs.Bitmap(this.loader.getResult(attributes.source.split('/').pop()));
	this.icon.sourceRect = new createjs.Rectangle(parseInt(attributes.cropX), parseInt(attributes.cropY), parseInt(attributes.width), parseInt(attributes.height));
	this.icon.regX = attributes.width / 2;
	this.icon.regY = attributes.height / 2;
}