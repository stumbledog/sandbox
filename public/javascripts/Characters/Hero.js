function Hero(data, x, y){
	this.hero_initialize(data, x, y);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.container_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(data, x, y){
	this.container_initialize();
	this.game = Game.getInstance();

	this.type = "hero";
	this.team = "player";
	this.ticks = 0;
	this.followers = [];

	this.max_health = this.health = data.health;
	this.speed = data.move_speed;
	this.level = data.level;
	this.exp = data.exp;
	this.resource_type = data.resource_type;
	this.max_resource = this.resource = data.resource;
	this.radius = 12;
	this.mass = 100;

	this.aggro_radius = 80;
	this.range = 24;
	this.attack_speed = 20;
	this.damage = 5;
	this.x = x;
	this.y = y;
	this.map = this.game.findPath({x:this.x,y:this.y});
	this.order = {action:"stop", map:this.game.findPath({x:this.x,y:this.y})};

	var frames = [];

	for(var i=0 ;i < 12; i++){
		frames.push([data.index % 4 *72+(i%3)*24,parseInt(data.index / 4) * 128+parseInt(i/3)*32+1,24,32,0,12,16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(data.id)],
		frames:frames,
		animations:{
			front:{
				frames:[0,1,2],
				speed:this.speed/10,
			},
			left:{
				frames:[3,4,5],
				speed:this.speed/10,
			},
			right:{
				frames:[6,7,8],
				speed:this.speed/10,
			},
			back:{
				frames:[9,10,11],
				speed:this.speed/10,
			},
		}
	});
	this.sprite = new createjs.Sprite(spriteSheet);
	this.sprite.z = 0;

	this.weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	this.weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	this.weapon.z = 1;
	this.weapon.regX = this.weapon.regY=12;
	this.weapon.scaleX = this.weapon.scaleY = 0.8;
	this.addChild(this.sprite, this.weapon);

	this.portrait = new createjs.Bitmap(this.game.getLoader().getResult(data.portrait_id));
	this.portrait.sourceRect = new createjs.Rectangle(data.index % 4 *96,parseInt(data.index / 4) * 96,96,96);

	this.rotate(0,0);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "stop";
	this.target = null;
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";

	this.initHealthBar();
}

Hero.prototype.getPortrait = function(){
	return this.portrait;
}

Hero.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	this.game.getUIStage().refreshHealthBar();
}

Hero.prototype.addFollower = function(follower){
	this.followers.push(follower);
}

Hero.prototype.tick = function(){
	switch(this.order.action){
		case "move":
		case "stop":
			//this.procMove()
			var velocity = this.getVelocity(this.x, this.y, this.game.getUnitStage().getUnitsExceptMe(this));
			this.x += velocity.vx;
			this.y += velocity.vy;
			this.rotate(velocity.vx, velocity.vy);
			break;
		case "move_attack":
			if(!this.target){
				this.target = this.findClosestEnemy(this.aggro_radius);
				if(this.target){
					this.order.alter_map = this.order.map;
					this.order.map = this.game.findPath({x:this.target.x,y:this.target.y});					
				}
			}else if(this.target.status === "death"){
				this.target = null;
				this.order.map = this.order.alter_map;
			}

			if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2) && this.ticks > this.attack_speed){
				this.ticks = 0;
				this.attackTarget(this.target);
			}else{
				var velocity = this.getVelocity(this.x, this.y, this.game.getUnitStage().getUnitsExceptMe(this));
				this.x += velocity.vx;
				this.y += velocity.vy;
				this.rotate(velocity.vx, velocity.vy);				
			}
			break;

	}
	/*
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.target.status === "death"){
			this.target = null;
		}else{
			if(this.ticks > this.attack_speed){
				this.ticks = 0;
				this.attackTarget(this.target);
			}
		}
	}else if(this.status === "move"){
		this.followPath(this.move_queue[this.move_queue.length-1], true);
	}else if(this.status === "move_attack"){
		this.target = this.findClosestEnemy(this.aggro_radius);
		this.followPath(null, null, true);
	}else if(this.status === "attack"){
		if(this.target){
			this.followPath(this.target, true);
		}else{
			//this.stop();
		}
	}*/
	this.ticks++;
}