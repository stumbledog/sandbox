function Unit_Stage(width, height, rows){
	this.initialize(width, height, rows);
}

createjs.extend(Unit_Stage, createjs.Stage);
Unit_Stage = createjs.promote(Unit_Stage, "Stage");

Unit_Stage.prototype.initialize = function(width, height, rows){
	this.canvas = document.getElementById("unit");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.Stage_constructor(this.canvas);
	this.enableMouseOver();
	
	this.game = Game.getInstance();
	this.map = this.game.getMapStage();
	this.mapSize = this.map.getSize();

	this.target = null;

	this.scroll_speed = 8;

	this.offsetX = this.offsetY = 0;
	createjs.Ticker.addEventListener("tick", function(){
		this.unit_container.sortChildren(function(obj1, obj2){
			return obj1.y>obj2.y?1:-1;
		});
		this.unit_container.children.forEach(function(unit){
			if(unit.status !== "death"){
				unit.tick();
			}
		});

		if(this.move_left && this.regX - this.scroll_speed >= 0){
			this.regX-=this.scroll_speed;
			this.map.regX-=this.scroll_speed;
			this.map.update();
		}else if(this.move_right &&  this.canvas.width/this.scaleX + this.regX + this.scroll_speed <= this.mapSize.width){
			this.regX+=this.scroll_speed;
			this.map.regX+=this.scroll_speed;
			this.map.update();
		}

		if(this.move_up && this.regY - this.scroll_speed >= 0){
			this.regY-=this.scroll_speed;
			this.map.regY-=this.scroll_speed;
			this.map.update();
		}else if(this.move_down &&  this.canvas.height/this.scaleY + this.regY + this.scroll_speed <= this.mapSize.height){
			this.regY+=this.scroll_speed;
			this.map.regY+=this.scroll_speed;
			this.map.update();
		}

		this.update();
	}.bind(this));
	createjs.Ticker.setFPS(60);

	this.initEvent();
	this.initContainer();
}

Unit_Stage.prototype.setTarget = function(enemy){
	this.target = enemy;
}

Unit_Stage.prototype.unsetTarget = function(enemy){
	this.target = enemy.id === this.target.id ? null : this.target;
}

Unit_Stage.prototype.initEvent = function(){
	this.on("stagemousemove", function(event){
		if(event.stageX > window.innerWidth - 50){
			this.move_right = true;
		}else{
			this.move_right = false;
		}

		if(event.stageX < 50){
			this.move_left = true;
		}else{
			this.move_left = false;
		}

		if(event.stageY > window.innerHeight - 50){
			this.move_down = true;
		}else{
			this.move_down = false;
		}

		if(event.stageY < 50){
			this.move_up = true;
		}else{
			this.move_up = false;
		}		
	}, this);
	
	this.on("stagemousedown", function(event){
		if(this.target && this.target.status === "death"){
			this.target = null;
		}
		if(event.nativeEvent.button == 2){
			if(this.target){
				this.hero.attack(this.target);
			}else{
				this.hero.move(event.stageX/this.scaleX + this.regX, event.stageY/this.scaleY + this.regY);
				/*
				this.getAlliedUnits(this.hero).forEach(function(unit){
					unit.follow(this.hero);
				}, this);*/
				this.setCommand("move");
			}
		}else if(event.nativeEvent.button == 0){
			if(this.command === "move"){
				console.log("select");
			}else if(this.command === "attack"){
				if(this.target){
					this.hero.attack(this.target);
					this.setCommand("move");
				}else{
					this.hero.moveAttack(event.stageX/this.scaleX + this.regX, event.stageY/this.scaleY + this.regY);
					this.setCommand("move_attack");
				}
			}
		}
		//this.update();
	}, this);

	document.onkeydown = function(event){
		switch(event.keyCode){
			case 27://esc
				this.setCommand("move");
				break;
			case 87://w
				break;
			case 68://d
				this.setCommand("assemble");
				break;
			case 83://s
				this.setCommand("stop");
				break;
			case 65://a
				this.setCommand("attack");
				break;
		}
		this.update();
	}.bind(this);

	document.addEventListener("mousewheel", function(event){
		this.game.setScale(event.wheelDelta/1000);
	}.bind(this), false);
	document.addEventListener("DOMMouseScroll", function(event){
		this.game.setScale(event.detail/100);
	}.bind(this), false);
}

Unit_Stage.prototype.initContainer = function(){
	this.unit_container = new createjs.Container();
	this.ui_container = new createjs.Container();
	this.addChild(this.unit_container, this.ui_container);
}

Unit_Stage.prototype.addHero = function(hero){
	this.hero = hero;
	this.unit_container.addChild(this.hero);
}

Unit_Stage.prototype.addFollower = function(follower){
	this.unit_container.addChild(follower);
	this.hero.followers.push(follower);
	follower.order = this.hero.order;
}

Unit_Stage.prototype.addUnit = function(unit, x, y){
	this.unit_container.addChild(unit);
}

Unit_Stage.prototype.removeUnit = function(target){
	this.unit_container.removeChild(target);
}

Unit_Stage.prototype.setCommand = function(type){
	switch(type){
		case "attack":
			this.command = "attack";
			this.canvas.classList.add("attack");
		break;
		case "move":
			this.command = "move";
			this.canvas.classList.remove("attack");
		break;
		case "stop":
			this.command = "move";
			this.canvas.classList.remove("attack");
			this.hero.stop();
		break;
		case "move_attack":
			this.command = "move_attack"
			this.canvas.classList.remove("attack");
	}
}

Unit_Stage.prototype.getUnits = function(self){
	return this.unit_container.children;
}
Unit_Stage.prototype.getUnitsExceptMe = function(self){
	return this.unit_container.children.filter(function(unit){return self.id !== unit.id && unit.status !== "death";});
}

Unit_Stage.prototype.getAlliedUnits = function(self){
	return this.unit_container.children.filter(function(unit){return self.team === unit.team && unit.status !== "death";});
}

Unit_Stage.prototype.getEnemies = function(self){
	return this.unit_container.children.filter(function(unit){return self.team !== unit.team && unit.status !== "death";});
}

Unit_Stage.prototype.findNeighbor = function(self, x, y){
	var new_blocks = [];
	blocks.forEach(function(row){
		new_blocks.push(row.slice(0));
	});
	this.unit_container.children.forEach(function(unit){
		if(unit.id !== self.id){
			new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)] = 1;
			if(unit.vx>0){
				new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)+1] = 1;
			}else if(unit.vx < 0){
				new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)-1] = 1;
			}
			if(unit.vy > 0 && new_blocks[parseInt(unit.y/16)+1]){
				new_blocks[parseInt(unit.y/16)+1][parseInt(unit.x/16)] = 1;
			}else if(unit.vy<0 && new_blocks[parseInt(unit.y/16)-1]){
				new_blocks[parseInt(unit.y/16)-1][parseInt(unit.x/16)] = 1;
			}
		}
	});
	var random = parseInt(Math.random() * 4);
	if(new_blocks[parseInt(y/16)+1] && new_blocks[parseInt(y/16)+1][parseInt(x/16)] === 0 && random === 0){
		return PathFinder.findPath(new_blocks, {x:x,y:y}, {x:x, y:y+16});
	}else if(new_blocks[parseInt(y/16)-1] && new_blocks[parseInt(y/16)-1][parseInt(x/16)] === 0 && random === 1){
		return PathFinder.findPath(new_blocks, {x:x,y:y}, {x:x, y:y-16});
	}else if(typeof new_blocks[parseInt(y/16)][parseInt(x/16)+1] !== "undefined" && new_blocks[parseInt(y/16)][parseInt(x/16)+1] === 0 && random === 2){
		return PathFinder.findPath(new_blocks, {x:x,y:y}, {x:x+16, y:y});
	}else if(typeof new_blocks[parseInt(y/16)][parseInt(x/16)-1] !== "undefined" && new_blocks[parseInt(y/16)][parseInt(x/16)-1] === 0 && random === 3){
		return PathFinder.findPath(new_blocks, {x:x,y:y}, {x:x-16, y:y});
	}
	return [];
}

Unit_Stage.prototype.setCanvasSize = function(width, height){
	this.canvas.width = width;
	this.canvas.height = height;
}