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

	this.health = 10;
	this.speed = 2;
	this.range = 32;
	this.attack_speed = 60;
	
	this.direction = "front";

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

	this.rotate("front");
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
	if(this.status === "move"){
		if(this.move_queue.length){
			if(Math.abs(this.move_queue[0].x - this.x) > this.speed || Math.abs(this.move_queue[0].y - this.y) > this.speed){
				var units = this.game.getUnits();
				units.forEach(function(unit){
					if(unit.id !== this.id && Math.pow(this.x-unit.x,2)+Math.pow(this.y-unit.y,2) < 64){
						var moving_radian = Math.atan2(this.vx,this.vy)+Math.PI;
						var collision_radian = Math.atan2(unit.x-this.x,unit.y-this.y)+Math.PI;
						if(unit.vx===0 && unit.vy===0){
							if(moving_radian - collision_radian >= 0 && moving_radian - collision_radian <= Math.PI){
								unit.x += Math.sin(moving_radian + Math.PI/2);
								unit.y += Math.cos(moving_radian + Math.PI/2);
							}else{
								unit.x += Math.sin(moving_radian - Math.PI/2);
								unit.y += Math.cos(moving_radian - Math.PI/2);
							}							
						}else{
							if(moving_radian - collision_radian >= 0 && moving_radian - collision_radian <= Math.PI){
								unit.x += Math.sin(moving_radian + Math.PI/2)*10;
								unit.y += Math.cos(moving_radian + Math.PI/2)*10;
							}else{
								unit.x += Math.sin(moving_radian - Math.PI/2)*10;
								unit.y += Math.cos(moving_radian - Math.PI/2)*10;
							}
						}

						//unit.y += Math.cos(radian) * this.speed*2;
						//unit.x += Math.sin(radian) * this.speed*2;
						//console.log(Math.atan2(this.x-unit.x,this.y-unit.y));
						//unit.y ++;
						//console.log(unit);
						/*
						this.vx = this.vy = 0;
						if(this.move_queue.length){
							this.move_queue = this.game.findPathToTarget({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
							this.shiftMoveQueue();
						}*/
					}
				},this);
				this.radian = Math.atan2(this.move_queue[0].x - this.x, this.move_queue[0].y - this.y);
				this.vx = Math.sin(this.radian) * this.speed;
				this.vy = Math.cos(this.radian) * this.speed;
				if(Math.abs(this.vx) > Math.abs(this.vy)){
					if(this.vx > 0 && this.direction !== "right"){
						this.rotate("right");
					}else if(this.vx < 0 && this.direction !== "left"){
						this.rotate("left");
					}
				}else{
					if(this.vy > 0 && this.direction !== "front"){
						this.rotate("front");
					}else if(this.vy < 0 && this.direction !== "back"){
						this.rotate("back");
					}
				}
				this.x += this.vx;
				this.y += this.vy;
			}else{
				this.move_queue = this.game.findPath(this, {x:this.x,y:this.y}, {x:this.move_queue[this.move_queue.length-1].x,y:this.move_queue[this.move_queue.length-1].y});
				//this.shiftMoveQueue();
			}
		}else{
			this.status = "stop";
			/*
			if(this.move_queue.length){
				this.shiftMoveQueue();
			}else{
				this.status = "stop";
			}*/
		}
	}else if(this.status === "attack"){
		if(Math.pow(this.x-this.target.x,2)+Math.pow(this.y-this.target.y,2) < Math.pow(this.range,2)){
			this.angle = Math.atan2(this.x - this.target.x, this.y - this.target.y);
			if(this.angle > Math.PI/4 && this.angle <= Math.PI*3/4){
				if(this.direction !== "left"){
					this.rotate("left");
				}
			}else if(this.angle > Math.PI*3/4 || this.angle <= -Math.PI*3/4){
				if(this.direction !== "front"){
					this.rotate("front");
				}
			}else if(this.angle > -Math.PI/4 && this.angle <= Math.PI/4){
				if(this.direction !== "back"){
					this.rotate("back");
				}
			}else if(this.angle > -Math.PI*3/4 && this.angle <= -Math.PI/4){
				if(this.direction !== "right"){
					this.rotate("right");
				}
			}
			if(this.attack_speed < this.ticks){
				this.ticks = 0;
				this.attackTarget(this.target);
			}
		}else{
			if(this.destination){
				if(Math.abs(this.destination.x - this.x) > this.speed || Math.abs(this.destination.y - this.y) > this.speed){
					var units = this.game.getUnits();
					units.forEach(function(unit){
						if(unit.id !== this.id && parseInt(unit.x/16) === parseInt((this.x + this.vx)/16) && parseInt(unit.y/16)===parseInt((this.y + this.vy)/16)){
							this.vx = this.vy = 0;
							if(this.move_queue.length){
								this.move_queue = this.game.findPathToTarget({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
								this.shiftMoveQueue();
							}
						}
					},this);
					this.x += this.vx;
					this.y += this.vy;
				}else{
					this.shiftMoveQueue();
				}
			}else{
				if(this.move_queue.length){
					this.shiftMoveQueue();
				}else{
					this.status = "stop";
				}
			}
		}
	}else if(this.status === "attack_move"){
		if(!this.target){
			var self = this;
			var enemies = this.game.getEnemies();
			var target = enemies.reduce(function(prev, cur){
				if(Math.pow(prev.x - self.x,2)+Math.pow(prev.y - self.y,2) < Math.pow(cur.x - self.x,2)+Math.pow(cur.y - self.y,2)){
					return prev;
				}else{
					return cur;
				}
			});
			if(Math.pow(target.x - this.x,2)+Math.pow(target.y - this.y,2) < 64*64){
				this.target = target;
			}
			if(this.destination){
				if(Math.abs(this.destination.x - this.x) > this.speed || Math.abs(this.destination.y - this.y) > this.speed){
					var units = this.game.getUnits();
					units.forEach(function(unit){
						if(unit.id !== this.id && parseInt(unit.x/16) === parseInt((this.x + this.vx)/16) && parseInt(unit.y/16)===parseInt((this.y + this.vy)/16)){
							this.vx = this.vy = 0;
							if(this.move_queue.length){
								this.move_queue = this.game.findPathToTarget({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
								this.shiftMoveQueue();
							}
						}
					},this);
					this.x += this.vx;
					this.y += this.vy;
				}else{
					this.shiftMoveQueue();
				}
			}else{
				if(this.move_queue.length){
					this.shiftMoveQueue();
				}else{
					this.status = "stop";
				}
			}
		}else{

		}
	}else if(this.status === "hold"){

	}else if(this.status === "stop"){

	}
/*
	if(this.status === "idle" && !this.target){
		var self = this;
		var enemies = this.game.getEnemies();
		if(enemies.length){
			var enemy = enemies.reduce(function(prev, current){
				if(Math.pow(prev.x-self.x,2)+Math.pow(prev.y-self.y,2) > Math.pow(current.x-self.x,2)+Math.pow(current.y-self.y,2)){
					return current;
				}else{
					return prev;
				}
			});
			this.target = enemy;
			this.moveAttack(enemy.x,enemy.y);			
		}
	}

	if(this.target){
		if((Math.pow(this.x - this.target.x,2)+Math.pow(this.y - this.target.y,2)) <= Math.pow(this.range,2)){
			this.vx = this.vy = 0;
			if(this.attack_speed < this.ticks){
				this.attackTarget(this.target);
				this.ticks = 0;
			}
		}
	}

	if(this.destination){
		if(Math.abs(this.destination.x - this.x) > this.speed || Math.abs(this.destination.y - this.y) > this.speed){
			var units = this.game.getUnits();
			units.forEach(function(unit){
				if(unit.id !== this.id && parseInt(unit.x/16) === parseInt((this.x + this.vx)/16) && parseInt(unit.y/16)===parseInt((this.y + this.vy)/16)){
					console.log("collision");
					this.vx = this.vy = 0;
					this.move_queue = this.game.findPathToTarget({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
					this.shiftMoveQueue();
				}
			},this);

			this.x += this.vx;
			this.y += this.vy;
		}else{
			this.shiftMoveQueue();
		}
	}else{
		if(this.move_queue.length){
			this.shiftMoveQueue();
		}
	}

	if(!this.destination && !this.target){
		this.status = "idle"
	}
	*/
	this.ticks++;
}