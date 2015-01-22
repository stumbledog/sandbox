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
	this.aggro_radius = 80;

	this.max_health = this.health = 10;
	this.speed = 2;
	this.range = 24;
	this.attack_speed = 10;
	this.damage = 0.1;
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
		if(event.nativeEvent.button == 2){
			self.game.setTarget(self);
		}else{

		}
	});
	this.addEventListener("rollover", function(event){
		if(self.status !== "death"){
			self.sprite.filters = [new createjs.ColorFilter(1,0,0,1)];
			self.sprite.cache(-12,-16,24,32);
			self.game.setTarget(self);
		}
	});
	this.addEventListener("rollout", function(event){
		if(self.status !== "death"){
			self.sprite.filters = null;
			self.sprite.uncache();
			self.game.unsetTarget(self);
		}
	});
}

Monster.prototype.hit = function(attacker, damage){
	Unit.prototype.hit.call(this, attacker, damage);
	if(this.status !== "attack"){
		this.status = "attack";
	}
}

Monster.prototype.tick = function(){
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.ticks > this.attack_speed){
			this.ticks = 0;
			this.attackTarget(this.target);
		}
	}else if(this.status === "idle"){
		this.target = this.findClosestEnemy(this.aggro_radius);
		if(this.target){
			this.status = "attack";
		}else{
			this.move_queue = this.game.findNeighbor(this, this.x, this.y);
			if(this.move_queue.length){
				this.status = "roaming";
			}
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
	}else if(this.status === "attack"){
		if(this.target && this.getSquareDistance(this.target) < Math.pow(this.aggro_radius,2)){
			this.followPath(this.target, true);
			/*
			if(this.move_queue && this.move_queue.length && (Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed)){
				this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
				this.vx = Math.sin(this.radian) * this.speed;
				this.vy = Math.cos(this.radian) * this.speed;

				var unit_coordinates = this.game.getUnitCoordinates();
				var indexX = parseInt((this.x + this.vx)/16);
				var indexY = parseInt((this.y + this.vy)/16);

				if(unit_coordinates[indexY] && unit_coordinates[indexY][indexX] && this.id !== unit_coordinates[indexY][indexX].id){
					target = unit_coordinates[indexY][indexX];
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.target, true);
					this.vx = this.vy = 0;
				}

				this.rotate(this.vx, this.vy);

				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
				this.x += this.vx;
				this.y += this.vy;
				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = this;
			}else{
				this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.target, true);
			}*/
		}else{
			this.target = null;
			this.status = "idle";
		}
	}
	this.ticks++;
}