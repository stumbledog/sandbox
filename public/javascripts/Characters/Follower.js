function Follower(file, index){
	console.log("Follower instance");
	this.follower_initialize(file, index);
}

Follower.prototype = new Unit();

Follower.prototype.constructor = Follower;

Follower.prototype.follower_initialize = function(file, index){
	this.initialize(file, index);
	console.log("Follower initialize");
	this.type="follower";
	this.status = "move";
}

Follower.prototype.tick = function(){
	console.log("aaa");
}

Follower.prototype.tick2 = function(){
	if(status === "move"){

	}else if(status === "attack"){

	}else if(status === "move_attack"){

	}else if(status === "idle"){

	}else if(status === "hold"){

	}

	if(this.status === "idle" && !this.target){
		var self = this;
		var enemies = this.game.getEnemies();
		//console.log(enemies);
		//console.log(this.game.getUnits().constructor);
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
		/*if(this.move_queue.length){
			this.shiftMoveQueue();
		}*/
	}

	if(!this.destination && !this.target){
		this.status = "idle"
	}
	this.ticks++;
}