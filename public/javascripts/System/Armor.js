function Armor(attributes, container, stage){
	this.armor_initialize(attributes, container, stage);
}

Armor.prototype = new Item();
Armor.prototype.constructor = Armor;

Armor.prototype.armor_initialize = function(attributes, container, stage){
/*
	armor:Number,
	armor_bonus:Number,
	attack_speed:Number,
	movement_speed:Number,
	strength:Number,
	agility:Number,
	intelligence:Number,
	stamina:Number,
	critical_rate:Number,
	critical_damage:Number,
	life_steal:Number,
	cooldown_reduce:Number,
	health_regen:Number,
	resource_regen:Number,
*/
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

	this.initialize(attributes, container, stage);
}

Armor.prototype.initDetail = function(){
	this.detail = new createjs.Container();
	var ratings = ["Common", "Magic", "Rare", "Epic", "Legendary"];
	var rating_text = new createjs.Text(ratings[this.rating - 1] + " Weapon", "bold 10px Arial", this.colors[this.rating - 1]);
	var name_text = new createjs.Text(this.name.replace("\n", " "), "10px Arial", "#000");	
	var armor_text = new createjs.Text("", "bold 16px Arial", "#C00");
	var level_text = new createjs.Text("Item Level: " + this.level, "10px Arial", "#000");

	level_text.x = armor_text.x = name_text.x = rating_text.x = rating_text.y = 2;
	name_text.y = 14;
	armor_text.y = 28;
	var offsetY = !this.armor ? 20 : 0;
	level_text.y = 48 + 14 * this.rating - offsetY;
	var armor = this.armor;

	if(this.armor_bonus){
		armor += this.armor_bonus;
	}

	armor_text.text = armor;

	var bg = new createjs.Shape();
	bg.graphics.s("#000").ss(1).f("#fff").dr(0, 0, 120, 62 + 14 * this.rating - offsetY);
	if(this.armor === 0){
		this.detail.addChild(bg, rating_text, name_text, level_text);
	}else{
		this.detail.addChild(bg, rating_text, name_text, armor_text, level_text);
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
				attr_text.text = "+" + this.health_regen + " per sec";
			break;
			case 10:
				attr_text.text = "+" + this.resource_regen + " per sec";
			break;
		}
		attr_text.x = 2;
		attr_text.y = 48 + 14 * index - offsetY;
		this.detail.addChild(attr_text);
	}, this);
}