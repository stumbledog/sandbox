function UI_Stage(width, height, rows){
	this.initialize(width, height, rows);
}

createjs.extend(UI_Stage, createjs.Stage);
UI_Stage = createjs.promote(UI_Stage, "Stage");

UI_Stage.prototype.initialize = function(width, height, rows){
	this.canvas = document.getElementById("ui");
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
			unit.tick();
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

	this.unit_coordinates = [];
	for(var i = 0 ; i < rows * 2 ; i++){
		this.unit_coordinates.push([]);
	}

	this.initEvent();
	this.initContainer();
}

UI_Stage.prototype.setTarget = function(enemy){
	this.target = enemy;
}

UI_Stage.prototype.unsetTarget = function(enemy){
	this.target = enemy.id === this.target.id ? null : this.target;
}

UI_Stage.prototype.initEvent = function(){
	this.on("stagemousemove", function(event){
		if(event.stageX > window.innerWidth-100){
			this.move_right = true;
		}else{
			this.move_right = false;
		}

		if(event.stageX < 100){
			this.move_left = true;
		}else{
			this.move_left = false;
		}

		if(event.stageY > window.innerHeight-100){
			this.move_down = true;
		}else{
			this.move_down = false;
		}

		if(event.stageY < 100){
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
				this.hero.setTarget(this.target);
			}else{
				this.hero.move(event.stageX/this.scaleX + this.regX, event.stageY/this.scaleY + this.regY);
				this.setCommand("move");
			}
		}else if(event.nativeEvent.button == 0){
			if(this.command === "move"){
				console.log("select");
			}else if(this.command === "attack"){
				if(this.target){
					this.hero.setTarget(this.target);
					this.setCommand("move");
				}else{
					this.hero.moveAttack(event.stageX/this.scaleX + this.regX, event.stageY/this.scaleY + this.regY);
					this.setCommand("move_attack");
				}
			}
		}
		this.update();
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
		this.game.setScale(event.wheelDelta);
	}.bind(this), false);
}

UI_Stage.prototype.initContainer = function(){
	this.unit_container = new createjs.Container();
	this.ui_container = new createjs.Container();
	this.addChild(this.unit_container, this.ui_container);
}

UI_Stage.prototype.renderUI = function(){
	var shape = new createjs.Shape();
	shape.graphics.f("#fff").dr(0, this.canvas.height - 52,52,52)
	var portrait = this.hero.getPortrait();
	portrait.scaleX = portrait.scaleY = 0.5;
	portrait.x = 2;
	portrait.y = this.canvas.height-50;
	this.ui_container.addChild(shape, portrait);
}

UI_Stage.prototype.addHero = function(hero, x, y){
	this.hero = hero;
	this.unit_container.addChild(this.hero);
	this.hero.x = x;
	this.hero.y = y;
	this.unit_coordinates[parseInt(y/16)][parseInt(x/16)] = this.hero;
	this.renderUI();
}

UI_Stage.prototype.addFollower = function(follower, x, y){
	this.unit_container.addChild(follower);
	follower.x = x;
	follower.y = y;
	this.unit_coordinates[parseInt(y/16)][parseInt(x/16)] = follower;
	this.hero.followers.push(follower);
}

UI_Stage.prototype.addUnit = function(unit, x, y){
	this.unit_container.addChild(unit);
	unit.x = x;
	unit.y = y;
	this.unit_coordinates[parseInt(y/16)][parseInt(x/16)] = unit;
}

UI_Stage.prototype.removeUnit = function(target){
	this.unit_container.removeChild(target);
}

UI_Stage.prototype.setCommand = function(type){
	switch(type){
		case "attack":
			this.command = "attack";
			document.getElementById("ui").classList.add("attack");
		break;
		case "move":
			this.command = "move";
			document.getElementById("ui").classList.remove("attack");
		break;
		case "stop":
			this.command = "move";
			document.getElementById("ui").classList.remove("attack");
			this.hero.stop();
		break;
		case "move_attack":
			this.command = "move_attack"
			document.getElementById("ui").classList.remove("attack");
	}
}

UI_Stage.prototype.getUnits = function(self){
	return this.unit_container.children;
}

UI_Stage.prototype.getEnemies = function(self){
	return this.unit_container.children.filter(function(unit){return self.team !== unit.team && unit.status !== "death";});
}

UI_Stage.prototype.findNeighbor = function(self, x, y){
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

UI_Stage.prototype.setCanvasSize = function(width, height){
	this.canvas.width = width;
	this.canvas.height = height;
}