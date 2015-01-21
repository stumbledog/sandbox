function Hero(file, index){
	this.hero_initialize(file, index);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.container_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(file, index){
	this.container_initialize();
	this.game = Game.getInstance();

	this.type="hero";
	this.ticks = 0;
	this.team = "player";

	this.health = 10;
	this.speed = 3;
	this.aggro_radius = 80;
	this.range = 16;
	this.attack_speed = 30;
	
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

	this.rotate(0,0);
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "stop";
	this.target = null;
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";

	this.initHealthBar();
}

Hero.prototype.setTarget = function(target){
	this.target = target;
	this.status = "attack";
	console.log("set target");
}

Hero.prototype.getTarget = function(){
	return this.tager;
}

Hero.prototype.tick = function(){
	if(this.target && this.getSquareDistance(this.target) <= Math.pow(this.range,2)){
		if(this.ticks > this.attack_speed){
			this.ticks = 0;
			this.attackTarget(this.target);
		}
	}else if(this.status === "move"){
		if(this.move_queue.length){
			if(Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed){
				this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
				this.vx = Math.sin(this.radian) * this.speed;
				this.vy = Math.cos(this.radian) * this.speed;

				var unit_coordinates = this.game.getUnitCoordinates();
				var indexX = parseInt((this.x + this.vx)/16);
				var indexY = parseInt((this.y + this.vy)/16);

				if(unit_coordinates[indexY] && unit_coordinates[indexY][indexX] && this.id !== unit_coordinates[indexY][indexX].id){
					target = unit_coordinates[indexY][indexX];
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.move_queue[this.move_queue.length-1], true);
					if(this.move_queue.length){
						this.destination = this.move_queue[this.move_queue.length-1];
					}
					this.vx = this.vy = 0;
				}

				this.rotate(this.vx, this.vy);

				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
				this.x += this.vx;
				this.y += this.vy;
				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = this;
			}else{
				this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.move_queue[this.move_queue.length-1], true);
				if(this.move_queue.length){
					this.destination = this.move_queue[this.move_queue.length-1];
				}
			}
		}else{
			if(this.destination){
				if(this.getSquareDistance(this.destination)<16){
					this.stop();
					console.log("stopped");
				}else{
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:this.destination.x,y:this.destination.y}, true);
					if(this.move_queue.length){
						this.destination = this.move_queue[this.move_queue.length-1];
					}
				}
			}else{
				
			}
		}
	}else if(this.status === "move_attack"){
		if(this.move_queue.length){
			if(Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed){				
				this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
				this.vx = Math.sin(this.radian) * this.speed;
				this.vy = Math.cos(this.radian) * this.speed;

				var unit_coordinates = this.game.getUnitCoordinates();
				var indexX = parseInt((this.x + this.vx)/16);
				var indexY = parseInt((this.y + this.vy)/16);

				if(unit_coordinates[indexY] && unit_coordinates[indexY][indexX] && this.id !== unit_coordinates[indexY][indexX].id){
					target = unit_coordinates[indexY][indexX];
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.move_queue[this.move_queue.length-1], false);
					/*
					if(this.move_queue.length){
						this.destination = this.move_queue[this.move_queue.length-1];
					}*/
					this.vx = this.vy = 0;
				}

				this.rotate(this.vx,this.vy);

				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = null;
				this.x += this.vx;
				this.y += this.vy;
				unit_coordinates[parseInt(this.y/16)][parseInt(this.x/16)] = this;

			}else{
				this.target = this.findClosestEnemy(this.aggro_radius);
				if(this.target){
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.target, false);	
				}else{
					this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, this.move_queue[this.move_queue.length-1], false);	
				}
			}
		}
	}
	this.ticks++;
}