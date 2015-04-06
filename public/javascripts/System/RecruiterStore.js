function RecruiterStore(units){
	this.recruiterstore_initialize(units);
}

RecruiterStore.prototype = Object.create(Store.prototype);
RecruiterStore.prototype.constructor = RecruiterStore;

RecruiterStore.prototype.recruiterstore_initialize = function(units){
	this.store_initialize(units);
	console.log(this.items);

	this.unit_container = new createjs.Container();
	this.unit_container.x = 5;
	this.unit_container.y = 50;

	this.initUnits();
	this.render();
}

RecruiterStore.prototype.initUnits = function(){
	this.items.forEach(function(unit, index){
		this.unitSummary(unit, index % 3 * 100, parseInt(index / 3) * 60);
		this.unitDetail(unit);
		this.unit_container.addChild(unit.store_summary);
	}, this);
}

RecruiterStore.prototype.unitSummary = function(unit, x, y){
	var frame = new createjs.Shape();
	frame.graphics.s("#000").ss(1).f("#fff").dr(0,0,100,60).dr(0,0,30,60).dr(30,45,70,15).f("#fff").dr(0,0,30,60);

	var frames = [];
	for(var i=0 ;i < 3; i++){
		frames.push([unit.index % 4 * 72 + (i % 3) * 24, parseInt(unit.index / 4) * 128 + parseInt(i / 3) * 32 + 1, 24, 32, 0, 12, 16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.loader.getResult(unit.sprite.split('/').pop())],
		frames:frames,
		animations:{
			front:{
				frames:[0,1,2,1],
				speed:0.2,
			}
		}
	});

	var sprite = new createjs.Sprite(spriteSheet, "front");
	sprite.x = 15;
	sprite.y = 30;

	var level = new createjs.Text("Level " + unit.level, "12px Arial","#000");
	level.x = 32;
	level.y = 2;

	var character_class = new createjs.Text(unit.character_class, "12px Arial","#000");
	character_class.x = 32;
	character_class.y = 16;

	var price_text = unit.price;
	var price = new createjs.Text(price_text, "12px Arial","#000");
	price.x = 32;
	price.y = 46;

	var coin = new createjs.Bitmap(this.loader.getResult("icon"));
	coin.sourceRect = new createjs.Rectangle(246, 55, 12, 12);
	coin.x = 33 + price.getMeasuredWidth();
	coin.y = 48;
	coin.scaleX = coin.scaleY = 0.8;

	unit.store_summary = new createjs.Container();
	unit.store_summary.x = x;
	unit.store_summary.y = y;

	unit.store_summary.addChild(frame, sprite, level, character_class, price, coin);
	unit.store_summary.cursor = "pointer";

	unit.store_summary.addEventListener("rollover", this.rolloverStore.bind(this, unit));
	unit.store_summary.addEventListener("rollout", this.rolloutStore.bind(this, unit));
	unit.store_summary.addEventListener("mousedown", this.mousedownStoreItem.bind(this, unit));
}

RecruiterStore.prototype.unitDetail = function(unit){
	var primary_attribute_text = ["Strength", "Agility", "Intelligence"];
	var primary_attribute_color = ["#F77A52", "#D8CAA8", "#91AA9D"];

	var frame = new createjs.Shape();
	frame.graphics.s("#000").ss(1).f("#fff").dr(0,0,140,120);

	var level = new OutlineText("Level " + unit.level + " " + unit.character_class, "10px Arial", primary_attribute_color[unit.primary_attribute], "#333", 3);
	level.x = 3;
	level.y = 2;

	var primary_attribute = new createjs.Text("Primary Attribute: " + primary_attribute_text[unit.primary_attribute], "10px Arial","#000");
	primary_attribute.x = 2;
	primary_attribute.y = 16;

	var strength = new createjs.Text("Strength: " + unit.strength, "10px Arial","#000");
	var agility = new createjs.Text("Agility: " + unit.agility, "10px Arial","#000");
	var Intelligence = new createjs.Text("Intelligence: " + unit.intelligence, "10px Arial","#000");
	strength.x = agility.x = Intelligence.x = 2;
	strength.y = 28;
	agility.y = 40;
	Intelligence.y = 52;

	var skill = new createjs.Text("Skills: ", "10px Arial","#000");
	skill.x = 2;
	skill.y = 64;

	unit.detail = new createjs.Container();
	unit.detail.addChild(frame, level, primary_attribute, strength, agility, Intelligence, skill);
}

RecruiterStore.prototype.renderUnits = function(){
	this.stage.addChild(this.unit_container);
	this.stage.update();
}

RecruiterStore.prototype.rolloverStore = function(item){	
	if(item.store_summary.x !== 200){
		var x = item.store_summary.x + 5;
	}else{
		var x = 165;
	}

	if(item.store_summary.y > 120){
		var y = item.store_summary.y - (item.summary_height) + 50;
	}else{
		var y = item.store_summary.y + 110;
	}

	item.detail.x = x;
	item.detail.y = y;
	this.stage.addChild(item.detail);
	this.stage.update();
}

RecruiterStore.prototype.rolloutStore = function(item){
	this.stage.removeChild(item.detail);
	this.stage.update();
}

RecruiterStore.prototype.mousedownStoreItem = function(item, event){
	if(event.nativeEvent.button === 2){
		if(this.user.gold < item.price){
			alert("Not enough money!");
		}else{
			item.x = 160; 
			item.y = 160; 
			var follower = new Follower(item);
			this.user.purchaseFollower(follower);
			$.post("purchasefollower", {follower:item}, function(res){
				console.log(res);
			});
		}
	}
}

RecruiterStore.prototype.open = function(){	
	Store.prototype.open.call(this);
	this.renderUnits();
	this.user.openInventory();
	this.user.isShopping = true;
	this.user.store = this;
}