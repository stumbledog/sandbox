function Consumable(attributes, container, stage, store){
	this.consumable_initialize(attributes, container, stage, store);
}

Consumable.prototype = new Item();
Consumable.prototype.constructor = Consumable;

Consumable.prototype.consumable_initialize = function(attributes, container, stage, store){
	this.health = attributes.health;
	this.attributes = attributes.attributes;

	this.initialize(attributes, container, stage, store);
}

Consumable.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var name_text = new createjs.Text(this.name.replace("\n", " "), "Bold 10px Arial", "#000");
	var description = new createjs.Text("", "10px Arial", "#B64926");
	if(this.health){
		description.text = "Restore "+this.health+"% of maxmimum\nhealth";
		this.summary_height = 40;
	}

	name_text.x = description.x = name_text.y = 2;
	description.y = 14;
	
	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 140, this.summary_height);

	this.detail.addChild(bg, name_text, description);
}