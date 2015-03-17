function Item(){

}

Item.prototype.initialize = function(attributes, container, stage, store){
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.stage = stage;
	this.container = container;

	this.name = attributes.name;
	this.rating = attributes.rating;
	this.price = attributes.price;
	this.colors = ["#ccc","#5C832F","#FFD34E"];

	this.initIcon(attributes.icon);
	this.initDetail();
	if(store){
		this.store = store;
		this.initStoreSummary();
	}
}

Item.prototype.initIcon = function(attributes){
	this.icon = new createjs.Bitmap(this.loader.getResult(attributes.source.split('/').pop()));
	this.icon.sourceRect = new createjs.Rectangle(attributes.cropX, attributes.cropY, attributes.width, attributes.height);
	this.icon.regX = attributes.width / 2;
	this.icon.regY = attributes.height / 2;
}

Item.prototype.rolloverStore = function(){
	if(this.store_summary.x !== 200){
		this.detail.x = this.store_summary.x;
	}else{
		this.detail.x = 160;
	}
	if(this.store_summary.y > 120){
		this.detail.y = this.store_summary.y - (this.summary_height);
	}else{
		this.detail.y = this.store_summary.y + 60;
	}
	this.container.addChild(this.detail);
	this.stage.update();
}

Item.prototype.rolloutStore = function(){
	this.container.removeChild(this.detail);
}


Item.prototype.initStoreSummary = function(){
	var frame = new createjs.Shape();
	frame.graphics.s("#000").ss(1).f("#fff").dr(0,0,100,60).dr(0,0,30,60).dr(30,45,70,15).f(this.colors[this.rating-1]).dr(0,0,30,60);

	var icon = this.icon.clone();
	icon.x = 15;
	icon.y = 30;

	var name = new createjs.Text(this.name, "12px Arial","#000");
	name.x = 32;
	name.y = 2;

	var price = new createjs.Text(this.price, "12px Arial","#000");
	price.x = 32;
	price.y = 46;

	var coin = new createjs.Bitmap(this.loader.getResult("icon"));
	coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
	coin.x = 33 + price.getMeasuredWidth();
	coin.y = 48;
	coin.scaleX = coin.scaleY = 0.8;

	this.store_summary = new createjs.Container();
	this.store_summary.addChild(frame, icon, name, price, coin);
	this.store_summary.cursor = "pointer";

	this.store_summary.addEventListener("rollover", this.rolloverStore.bind(this));
	this.store_summary.addEventListener("rollout", this.rolloutStore.bind(this));
	this.store_summary.addEventListener("mousedown", function(event){
		if(event.nativeEvent.button === 2){
			if(this.user.gold >= this.price && this.user.inventory.haveAvailableSpace()){
				$.post("purchaseitem",{item:this.toJSON()},function(res){

				});
				this.store.removeItem(this);
				this.purchase();
			}else{

			}
		}
	}.bind(this));
}

Item.prototype.toJSON = function(){

}

Item.prototype.purchase = function(){
	this.user.purchase(this);
}

Item.prototype.generateItem = function(){

}