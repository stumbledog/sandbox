function Weapon(attributes){
	this.weapon_initialize(attributes);
}

Weapon.prototype = new Item();
Weapon.prototype.constructor = Weapon;

Weapon.prototype.weapon_initialize = function(attributes){
	this._id = attributes._id;
	this.hand = parseInt(attributes.hand);
	this.level = parseInt(attributes.level);
	this.min_damage = parseFloat(attributes.min_damage);
	this.max_damage = parseFloat(attributes.max_damage);
	this.attack_speed = parseInt(attributes.attack_speed);
	this.range = parseInt(attributes.range);
	this.min_damage_bonus = parseFloat(attributes.min_damage_bonus);
	this.max_damage_bonus = parseFloat(attributes.max_damage_bonus);
	this.attack_speed_bonus = parseInt(attributes.attack_speed_bonus);
	this.strength = parseInt(attributes.strength);
	this.agility = parseInt(attributes.agility);
	this.intelligence = parseInt(attributes.intelligence);
	this.critical_rate = parseInt(attributes.critical_rate);
	this.critical_damage = parseInt(attributes.critical_damage);
	this.life_steal = parseInt(attributes.life_steal);
	this.attributes = attributes.attributes;

	this.initialize(attributes);
}

Weapon.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var ratings = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
	var rating_text = new OutlineText(ratings[this.rating - 1] + " Weapon", "10px Arial", this.colors[this.rating - 1], "#333", 3);
	var name_text = new createjs.Text(this.name.replace("\n", " "), "10px Arial", "#000");
	var hand_text = new createjs.Text(this.hand+"-hand", "10px Arial", "#000");
	var damage_amount_text = new createjs.Text("", "bold 16px Arial", "#C00");
	var damage_text = new createjs.Text("Damage", "10px Arial", "#C00");
	var attack_speed_text = new createjs.Text("", "10px Arial", "#000");
	var dps_text = new createjs.Text("", "10px Arial", "#000");
	var level_text = new createjs.Text("Item Level: " + this.level, "10px Arial", "#000");
	this.sell_price_text = new createjs.Text(this.sell_price, "10px Arial", "#000");
	this.sell_price_coin = this.coin.clone();

	rating_text.x = 3;
	level_text.x = dps_text.x = attack_speed_text.x = damage_amount_text.x = name_text.x = rating_text.y = 2;
	this.sell_price_text.x = 126 - this.sell_price_text.getMeasuredWidth();
	this.sell_price_coin.x = 128;
	hand_text.x = 140 - hand_text.getMeasuredWidth() - 2;
	name_text.y = hand_text.y = 14;
	damage_amount_text.y = 28;
	damage_text.y = 32;
	attack_speed_text.y = 48;
	dps_text.y = 62;
	this.sell_price_coin.y = this.sell_price_text.y = level_text.y = 76 + 14 * this.rating;

	var min_damage = this.min_damage;
	var max_damage = this.max_damage;

	if(this.min_damage_bonus && this.max_damage_bonus){
		min_damage += this.min_damage_bonus;
		max_damage += this.max_damage_bonus;
	}

	damage_amount_text.text = min_damage + " ~ " + max_damage;
	damage_text.x = damage_amount_text.getMeasuredWidth() + 4;

	if(this.attack_speed_bonus){
		var attack_speed = (60 / (this.attack_speed * (100 - this.attack_speed_bonus) / 100)).toFixed(1);
	}else{
		var attack_speed = (60 / this.attack_speed).toFixed(1);
	}

	attack_speed_text.text = attack_speed + " Attacks Per Sec";

	var dps = ((min_damage + max_damage) * attack_speed / 2).toFixed(1);
	dps_text.text = dps + " DPS";

	this.summary_height = 90 + 14 * this.rating;
	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 140, this.summary_height);
	this.detail.addChild(bg, rating_text, name_text, hand_text, damage_amount_text, damage_text, attack_speed_text, dps_text, level_text, this.sell_price_text, this.sell_price_coin);
	this.attributes.forEach(function(attribute, index){
		var attr_text = new createjs.Text("","10px Arial","#B64926");
		switch(parseInt(attribute)){
			case 0:
				attr_text.text = "+" + this.min_damage_bonus + " ~ " + this.max_damage_bonus + " Damage";
			break;
			case 1:
				if(this.strength){
					attr_text.text = "+" + this.strength + " Strength";
				}else if(this.agility){
					attr_text.text = "+" + this.agility + " Agility";
				}else{
					attr_text.text = "+" + this.intelligence + " Intelligence";
				}
			break;
			case 2:
				attr_text.text = "+" + this.attack_speed_bonus + "% Attack speed";
			break;
			case 3:
				attr_text.text = "+" + this.critical_rate + "% Critical rate";
			break;
			case 4:
				attr_text.text = "+" + this.critical_damage + "% Critical damage";
			break;
			case 5:
				attr_text.text = "+" + this.life_steal + "% Life Steal";
			break;
		}
		attr_text.x = 2;
		attr_text.y = 76 + 14 * index;
		this.detail.addChild(attr_text);
	}, this);
}