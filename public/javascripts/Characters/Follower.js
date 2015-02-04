function Follower(file, index, x, y){
	this.follower_initialize(file, index, x, y);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;
Follower.prototype.container_initialize = Follower.prototype.initialize;

Follower.prototype.follower_initialize = function(file, index, x, y){
	this.container_initialize();
	this.game = Game.getInstance();
	this.type = "follower";
	this.team = "player";
	this.ticks = 60;
	this.aggro_radius = 200;
	this.max_health = this.health = 10;
	this.speed = 3;
	this.range = 32;
	this.attack_speed = 60;
	this.damage = 2;
	this.radius = 12;
	this.mass = 1;
	this.x = x;
	this.y = y;
	this.velocity = new Vector(0,0);
	this.acceleration = new Vector(0,0);
	//this.order = {action:"guard",x:this.x, y:this.y, map:this.game.findPath({x:this.x,y:this.y})};
	this.order = {action:"annihilate", map:this.game.findPath({x:this.x,y:this.y})};
	this.max_force = 0.3;
	
	var frames = [];
	var offsetX = index % 4 *72;
	var offsetY = parseInt(index / 4) * 128;

	for(var i=0 ;i < 12; i++){
		frames.push([offsetX+(i%3)*24,offsetY+parseInt(i/3)*32+1,24,32,0,12,16]);
	}

	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(file)],
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

	this.direction = "back";
	this.rotate(0,1);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.isAttack = false;
	this.target = null;
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";
	this.damage_color = "#C00";

	this.initHealthBar();
}

