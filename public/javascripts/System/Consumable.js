function Consumable(attributes){
	this.consumable_initialize(attributes);
}

Consumable.prototype = new Item();
Consumable.prototype.constructor = Consumable;

Consumable.prototype.consumable_initialize = function(attributes){
	this.health = attributes.health;
	this.qty = attributes.qty;
	this.cooldown = attributes.cooldown;

	this.attributes = attributes.attributes;

	this.initialize(attributes);
}

Consumable.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var name_text = new createjs.Text(this.name.replace("\n", " "), "Bold 10px Arial", "#000");
	var description = new createjs.Text("", "10px Arial", "#B64926");
	var cooldown = new createjs.Text("Cooldown: " + this.cooldown + " Sec", "10px Arial", "#000");
	this.sell_price_text = new createjs.Text(this.sell_price * this.qty, "10px Arial", "#000");
	this.sell_price_coin = this.coin.clone();

	cooldown.x = name_text.x = description.x = name_text.y = 2;
	this.sell_price_text.x = 126 - this.sell_price_text.getMeasuredWidth();
	this.sell_price_coin.x = 128;
	description.y = 14;

	if(this.health){
		description.text = "Restore "+this.health+"% of maxmimum\nhealth";
		this.summary_height = 52;
		this.sell_price_coin.y = this.sell_price_text.y = cooldown.y = 38;
	}

	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 140, this.summary_height);

	this.detail.addChild(bg, name_text, description, cooldown, this.sell_price_coin, this.sell_price_text);
}

Consumable.prototype.userItem = function(){

}