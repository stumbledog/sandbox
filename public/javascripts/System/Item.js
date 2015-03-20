function Item(){

}

Item.prototype.initialize = function(attributes){
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.container = new createjs.Container();

	this.name = attributes.name;
	this.rating = parseInt(attributes.rating);
	this.price = parseInt(attributes.price);
	this.sell_price = Math.ceil(attributes.price / 2);
	this.colors = ["#CCC","#79BD8F","#FFD34E","#644D52","#F77A52"];

	this.initIcon(attributes.icon);
	this.initDetail();

	this.obj = attributes;
}

Item.prototype.initIcon = function(attributes){
	this.icon = new createjs.Bitmap(this.loader.getResult(attributes.source.split('/').pop()));
	this.icon.sourceRect = new createjs.Rectangle(parseInt(attributes.cropX), parseInt(attributes.cropY), parseInt(attributes.width), parseInt(attributes.height));
	this.icon.regX = attributes.width / 2;
	this.icon.regY = attributes.height / 2;

	this.coin = new createjs.Bitmap(this.loader.getResult("icon"));
	this.coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
	this.coin.scaleX = this.coin.scaleY = 0.8;
}

Item.prototype.showDetail = function(x, y, container){
	if(this.bin.constructor.name === "Inventory"){
		this.sell_price_text.visible = true;
		this.sell_price_coin.visible = true;
	}else{
		this.sell_price_text.visible = false;
		this.sell_price_coin.visible = false;
	}
	this.detail.x = x;
	this.detail.y = y;
	container.addChild(this.detail);
}

Item.prototype.sellItem = function(){
	
}