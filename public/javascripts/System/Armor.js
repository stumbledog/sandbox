function Armor(attributes, container, stage, store){
	this.armor_initialize(attributes, container, stage, store);
}

Armor.prototype = new Item();
Armor.prototype.constructor = Armor;

Armor.prototype.armor_initialize = function(attributes, container, stage, store){
	this.level = attributes.level;
	this.armor = attributes.armor;
	this.armor_bonus = attributes.armor_bonus;
	this.attack_speed = attributes.attack_speed;
	this.movement_speed = attributes.movement_speed;
	this.strength = attributes.strength;
	this.agility = attributes.agility;
	this.intelligence = attributes.intelligence;
	this.stamina = attributes.stamina;
	this.critical_rate = attributes.critical_rate;
	this.critical_damage = attributes.critical_damage;
	this.life_steal = attributes.life_steal;
	this.cooldown_reduce = attributes.cooldown_reduce;
	this.health_regen = attributes.health_regen;
	this.resource_regen = attributes.resource_regen;
	this.attributes = attributes.attributes;

	this.initialize(attributes, container, stage, store);
}

Armor.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var ratings = ["Common", "Magic", "Rare", "Epic", "Legendary"];
	var rating_text = new createjs.Text(ratings[this.rating - 1] + " Armor", "bold 10px Arial", this.colors[this.rating - 1]);
	var name_text = new createjs.Text(this.name.replace("\n", " "), "10px Arial", "#000");	
	var armor_amount_text = new createjs.Text("", "bold 16px Arial", "#3E606F");
	var armor_text = new createjs.Text("Armor", "10px Arial", "#3E606F");
	var level_text = new createjs.Text("Item Level: " + this.level, "10px Arial", "#000");

	level_text.x = armor_amount_text.x = name_text.x = rating_text.x = rating_text.y = 2;
	name_text.y = 14;
	armor_amount_text.y = 28;
	armor_text.y = 32;
	var offsetY = !this.armor ? 20 : 0;
	level_text.y = 48 + 14 * this.rating - offsetY;
	var armor = this.armor;

	if(this.armor_bonus){
		armor += this.armor_bonus;
	}

	armor_amount_text.text = armor;
	armor_text.x = armor_amount_text.getMeasuredWidth() + 4;

	this.summary_height = 62 + 14 * this.rating - offsetY;
	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 140, this.summary_height);
	if(this.armor === 0){
		this.detail.addChild(bg, rating_text, name_text, level_text);
	}else{
		this.detail.addChild(bg, rating_text, name_text, level_text, armor_amount_text, armor_text);
	}

	this.attributes.forEach(function(attribute, index){
		var attr_text = new createjs.Text("","10px Arial","#B64926");
		switch(attribute){
			case 0:
				attr_text.text = "+" + this.armor_bonus + " Armor";
			break;
			case 1:
				attr_text.text = "+" + this.attack_speed + "% Attack speed";
			break;
			case 2:
				attr_text.text = "+" + this.movement_speed + "% Movement speed";
			break;
			case 3:
				if(this.strength){
					attr_text.text = "+" + this.strength + " Strength";
				}else if(this.agility){
					attr_text.text = "+" + this.agility + " Agility";
				}else{
					attr_text.text = "+" + this.intelligence + " Intelligence";
				}
			break;
			case 4:
				attr_text.text = "+" + this.stamina + " Stamina";
			break;
			case 5:
				attr_text.text = "+" + this.critical_rate + "% Critical rate";
			break;
			case 6:
				attr_text.text = "+" + this.critical_damage + "% Critical damage";
			break;			
			case 7:
				attr_text.text = "+" + this.life_steal + "% Life Steal";
			break;
			case 8:
				attr_text.text = "+" + this.cooldown_reduce + "% Cooldown reduce";
			break;
			case 9:
				attr_text.text = "+" + this.health_regen + " Health regen per sec";
			break;
			case 10:
				attr_text.text = "+" + this.resource_regen + " Resource regen per sec";
			break;
		}
		attr_text.x = 2;
		attr_text.y = 48 + 14 * index - offsetY;
		this.detail.addChild(attr_text);
	}, this);
}