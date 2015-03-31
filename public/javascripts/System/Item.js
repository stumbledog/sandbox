function Item(){

}

Item.prototype.initialize = function(attributes){
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.container = new createjs.Container();

	this._id = attributes._id;
	this.type = attributes.type;
	this.index = -1;
	this.name = attributes.name;

	this.icon = attributes.icon;
	this.sprite = attributes.sprite;

	this.rating = parseInt(attributes.rating);
	this.price = parseInt(attributes.price);
	this.sell_price = Math.ceil(attributes.price / 2);
	this.colors = ["#CCC","#79BD8F","#FFD34E","#644D52","#F77A52"];
	this.repurchase = false;

	this.initIcon();
	this.initDetail();
}

Item.prototype.initIcon = function(){
	this.icon_img = new createjs.Bitmap(this.loader.getResult(this.icon.source.split('/').pop()));
	this.icon_img.sourceRect = new createjs.Rectangle(parseInt(this.icon.cropX), parseInt(this.icon.cropY), parseInt(this.icon.width), parseInt(this.icon.height));
	this.icon_img.regX = this.icon.width / 2;
	this.icon_img.regY = this.icon.height / 2;

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

Item.prototype.toObject = function(){
	var obj = {};
	for(key in this){
		if((typeof this[key] === "boolean" || typeof this[key] === "string" || typeof this[key] === "number"  && !isNaN(this[key]) || key === "attributes" || key === "icon" && this[key] || key === "sprite" && this[key]) && key !== "summary_height"){
			obj[key] = this[key];
		}
	}
	console.log(obj);
	return obj;
}