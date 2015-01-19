function Hero(file, index){
	console.log("Hero instance");
	this.hero_initialize(file, index);
}

Hero.prototype = new Unit();

Hero.prototype.constructor = Hero;
Hero.prototype.container_initialize = Hero.prototype.initialize;

Hero.prototype.hero_initialize = function(file, index){
	console.log("Hero initialize");
	this.container_initialize();
	this.game = Game.getInstance();

	this.type="hero";
	this.ticks = 0;

	this.health = 10;
	this.speed = 3;
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

	this.weapon = new createjs.Bitmap(this.game.getLoader().getResult("icon"));
	this.weapon.sourceRect = new createjs.Rectangle(292,100,16,16);
	this.weapon.z = 1;
	this.weapon.regX = this.weapon.regY=12;
	this.weapon.rotation = this.direction;
	this.weapon.scaleX = this.weapon.scaleY = 0.8;

	this.addChild(this.sprite, this.weapon);

	this.rotate("front");
	this.shadow = new createjs.Shadow("#333",3,3,10);
	this.status = "stop";
	this.destination = null;
	this.move_queue = [];
	this.color = "#0C0";
	this.initHealthBar();
}

Hero.prototype.tick = function(){
	
	if(this.status === "move"){
		if(this.destination){
			if(Math.abs(this.destination.x - this.x) > this.speed || Math.abs(this.destination.y - this.y) > this.speed){
				var units = this.game.getUnits();
				units.forEach(function(unit){
					if(unit.id !== this.id && parseInt(unit.x/16) === parseInt((this.x + this.vx)/16) && parseInt(unit.y/16)===parseInt((this.y + this.vy)/16)){
						this.vx = this.vy = 0;
						if(this.move_queue.length){
							this.move_queue = this.game.findAlterPath({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
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
	}else if(this.status === "attack"){

	}else if(this.status === "attack_move"){

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
					this.move_queue = this.game.findAlterPath({x:parseInt(unit.x/16),y:parseInt(unit.y/16)},{x:this.x,y:this.y},this.move_queue.pop());
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