function Armor(builder){
	this.armor_initialize(builder);
}

Armor.prototype = new Item();
Armor.prototype.constructor = Armor;

Armor.prototype.armor_initialize = function(builder){
	this._id = builder._id;
	this.level = builder.level;
	this.part = builder.part;
	this.qty = 1;
	/*
	this.armor = parseInt(attributes.armor);
	this.armor_bonus = parseInt(attributes.armor_bonus);
	this.attack_speed_bonus = parseInt(attributes.attack_speed_bonus);
	this.movement_speed = parseInt(attributes.movement_speed);
	this.strength = parseInt(attributes.strength);
	this.agility = parseInt(attributes.agility);
	this.intelligence = parseInt(attributes.intelligence);
	this.stamina = parseInt(attributes.stamina);
	this.critical_rate = parseInt(attributes.critical_rate);
	this.critical_damage = parseInt(attributes.critical_damage);
	this.life_steal = parseInt(attributes.life_steal);
	this.cooldown_reduce = parseInt(attributes.cooldown_reduce);
	this.health_regen = parseInt(attributes.health_regen);
	this.resource_regen = parseInt(attributes.resource_regen);
	*/
	this.armor = builder.armor;
	this.attributes = builder.attributes;
	this.attributes_index = builder.attributes_index;
	this.builder = builder;

	this.initialize(builder);
}

Armor.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var ratings = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
	var rating_text = new OutlineText(ratings[this.rating - 1] + " Armor", "10px Arial", this.colors[this.rating - 1], "#333", 3);
	var name_text = new createjs.Text(this.name.replace("\n", " "), "10px Arial", "#000");
	var armor_amount_text = new createjs.Text("", "bold 16px Arial", "#3E606F");
	var armor_text = new createjs.Text("Armor", "10px Arial", "#3E606F");
	var level_text = new createjs.Text("Item Level: " + this.level, "10px Arial", "#000");
	this.sell_price_text = new createjs.Text(this.sell_price, "10px Arial", "#000");
	this.sell_price_coin = this.coin.clone();

	rating_text.x = 3;
	level_text.x = armor_amount_text.x = name_text.x = rating_text.y = 2;
	this.sell_price_text.x = 126 - this.sell_price_text.getMeasuredWidth();
	this.sell_price_coin.x = 128;
	name_text.y = 14;
	armor_amount_text.y = 28;
	armor_text.y = 32;
	var offsetY = !this.armor ? 20 : 0;
	this.sell_price_coin.y = this.sell_price_text.y = level_text.y = 48 + 14 * this.rating - offsetY;
	var armor = this.armor;

	if(this.attributes.armor_bonus){
		armor += parseFloat(this.attributes.armor_bonus);
	}

	armor_amount_text.text = armor;
	armor_text.x = armor_amount_text.getMeasuredWidth() + 4;
	this.summary_height = 62 + 14 * this.rating - offsetY;
	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 140, this.summary_height);
	if(this.armor === 0){
		this.detail.addChild(bg, rating_text, name_text, level_text, this.sell_price_text, this.sell_price_coin);
	}else{
		this.detail.addChild(bg, rating_text, name_text, level_text, armor_amount_text, armor_text, this.sell_price_text, this.sell_price_coin);
	}

	this.attributes_index.forEach(function(attribute, index){
		var attr_text = new createjs.Text("","10px Arial","#B64926");
		switch(parseInt(attribute)){
			case 0:
				attr_text.text = "+" + this.attributes.armor_bonus + " Armor";
			break;
			case 1:
				if(this.attributes.strength){
					attr_text.text = "+" + this.attributes.strength + " Strength";
				}else if(this.attributes.agility){
					attr_text.text = "+" + this.attributes.agility + " Agility";
				}else{
					attr_text.text = "+" + this.attributes.intelligence + " Intelligence";
				}
			break;
			case 2:
				attr_text.text = "+" + this.attributes.stamina + " Stamina";
			break;
			case 3:
				attr_text.text = "+" + this.attributes.attack_speed_bonus + "% Attack speed";
			break;
			case 4:
				attr_text.text = "+" + this.attributes.movement_speed + "% Movement speed";
			break;
			case 5:
				attr_text.text = "+" + this.attributes.critical_rate + "% Critical rate";
			break;
			case 6:
				attr_text.text = "+" + this.attributes.critical_damage + "% Critical damage";
			break;			
			case 7:
				attr_text.text = "+" + this.attributes.life_steal + "% Life Steal";
			break;
			case 8:
				attr_text.text = "+" + this.attributes.cooldown_reduce + "% Cooldown reduce";
			break;
			case 9:
				attr_text.text = "+" + this.attributes.health_regen + " Health regen per 5sec";
			break;
			case 10:
				attr_text.text = "+" + this.attributes.resource_regen + " Resource regen per sec";
			break;
		}
		attr_text.x = 2;
		attr_text.y = 48 + 14 * index - offsetY;
		this.detail.addChild(attr_text);
	}, this);
}