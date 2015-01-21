function Monster(file, index){
	this.monster_initialize(file, index);
}

Monster.prototype = new Unit();

Monster.prototype.constructor = Monster;
Monster.prototype.container_initialize = Monster.prototype.initialize;

Monster.prototype.monster_initialize = function(file, index){
	this.container_initialize();
	this.game = Game.getInstance();
	
	this.type = "monster";
	this.team = "enemy";

	this.ticks = 0;

	this.max_health = this.health = 10;
	this.speed = 0.1;
	this.range = 32;
	this.attack_speed = 30;
	
	this.direction = 180;

	this.frames = [];
	var offsetX = index % 4 *72;
	var offsetY = parseInt(index / 4) * 128;

	for(var i=0 ;i < 12; i++){
		this.frames.push([offsetX+(i%3)*24,offsetY+parseInt(i/3)*32+1,24,32,0,12,16]);
	}
	
	var spriteSheet = new createjs.SpriteSheet({
		images:[this.game.getLoader().getResult(file)],
		frames:this.frames,
		animations:{
			front:{
				frames:[0,1,2],
				speed:0.1
			},
			left:{
				frames:[3,4,5],
				speed:0.1
			},
			right:{
				frames:[6,7,8],
				speed:0.1
			},
			back:{
				frames:[9,10,11],
				speed:0.1
			},
		}
	});

	this.sprite = new createjs.Sprite(spriteSheet);
	this.sprite.z = 0;
	this.addChild(this.sprite);

	this.rotate(0,0);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "idle";
	this.destination = null;
	this.move_queue = [];
	this.color = "#C00";
	this.vx = this.vy = 0

	this.initEventListener();
	this.initHealthBar();
}

Monster.prototype.initEventListener = function(){
	var self = this;
	this.addEventListener("mousedown", function(event){
		console.log("set target");
		self.game.setTarget(self);
	});
	this.addEventListener("rollover", function(event){
		self.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
		self.sprite.cache(-12,-16,24,32);
	});
	this.addEventListener("rollout", function(event){
		self.sprite.filters = null;
		self.sprite.uncache();
	});
}

Monster.prototype.tick = function(){
	if(this.status === "idle"){
		this.move_queue = this.game.findNeighbor(this, this.x, this.y);
		if(this.move_queue.length){
			this.status = "roaming";
		}
	}else if(this.status === "roaming"){
		if(this.move_queue.length){
			if(Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed){
				this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
				this.vx = Math.sin(this.radian) * this.speed;
				this.vy = Math.cos(this.radian) * this.speed;
				this.rotate(this.vx, this.vy);
				var unit_coordinates = this.game.getUnitCoordinates();
				if(unit_coordinates[parseInt((this.y+this.vy)/16)] 
					&& unit_coordinates[parseInt((this.y+this.vy)/16)][parseInt((this.x+this.vx)/16)]
					&& this.id !== unit_coordinates[parseInt((this.y+this.vy)/16)][parseInt((this.x+this.vx)/16)].id){
					this.vx =this.vy = 0;
					this.status = "idle";
				}
				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
				this.x += this.vx;
				this.y += this.vy;
				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = this;
			}else{
				this.status = "idle";
			}
		}else{
			this.status = "idle";
		}
	}
	this.ticks++;
}