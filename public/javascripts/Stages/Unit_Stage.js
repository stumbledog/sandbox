function Unit_Stage(width, height, rows){
	this.initialize(width, height, rows);
}

createjs.extend(Unit_Stage, createjs.Stage);
Unit_Stage = createjs.promote(Unit_Stage, "Stage");

Unit_Stage.prototype.initialize = function(width, height, rows){
	this.width = width;
	this.height = height;
	this.canvas = document.getElementById("unit");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.Stage_constructor(this.canvas);
	this.enableMouseOver();
	
	this.game = Game.getInstance();
	this.loader = this.game.getLoader();
	this.map = this.game.getMapStage();
	this.mapSize = this.map.getSize();
	this.minimap = this.game.getMinimapStage();

	//this.scroll_speed = 8;
	this.followership_type = "follow"

	this.offsetX = this.offsetY = 0;
	this.ticks = 0;

	createjs.Ticker.addEventListener("tick", function(){
		this.unit_container.sortChildren(function(obj1, obj2){
			return obj1.y>obj2.y?1:-1;
		});
		this.unit_container.children.forEach(function(unit){
			if(unit.status !== "death"){
				unit.tick();
			}
		});
		/*
		if(this.move_left && this.regX - this.scroll_speed >= 0){
			this.regX -= this.scroll_speed;
			this.map.regX -= this.scroll_speed;
			this.map.update();
		}else if(this.move_right &&  this.canvas.width/this.scaleX + this.regX + this.scroll_speed <= this.mapSize.width){
			this.regX += this.scroll_speed;
			this.map.regX += this.scroll_speed;
			this.map.update();
		}

		if(this.move_up && this.regY - this.scroll_speed >= 0){
			this.regY -= this.scroll_speed;
			this.map.regY -= this.scroll_speed;
			this.map.update();
		}else if(this.move_down &&  this.canvas.height/this.scaleY + this.regY + this.scroll_speed <= this.mapSize.height){
			this.regY += this.scroll_speed;
			this.map.regY += this.scroll_speed;
			this.map.update();
		}*/
		if(this.ticks % 10 === 0){
			this.minimap.renderUnits(this.getUnits());
		}
		this.update();
		this.ticks++;
	}.bind(this));
	createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
	createjs.Ticker.setFPS(30);

	this.mouse_position = new Vector(0,0);

	this.initEvent();
	this.initContainer();
	this.effect = new Effect(this.effect_container, this.loader);
}

Unit_Stage.prototype.setTarget = function(enemy){
	this.target = enemy;
}

Unit_Stage.prototype.unsetTarget = function(enemy){
	this.target = enemy.id === this.target.id ? null : this.target;
}

Unit_Stage.prototype.initEvent = function(){
	this.on("stagemousemove", function(event){
		this.mouse_position.x = event.stageX/this.scaleX + this.regX;
		this.mouse_position.y = event.stageY/this.scaleY + this.regY;
		/*
		if(event.stageX > window.innerWidth - 20){
			this.move_right = true;
		}else{
			this.move_right = false;
		}

		if(event.stageX < 20){
			this.move_left = true;
		}else{
			this.move_left = false;
		}

		if(event.stageY > window.innerHeight - 20){
			this.move_down = true;
		}else{
			this.move_down = false;
		}

		if(event.stageY < 20){
			this.move_up = true;
		}else{
			this.move_up = false;
		}*/
	}, this);

	this.on("stagemousedown", function(event){
		var x = event.stageX/this.scaleX + this.regX;
		var y = event.stageY/this.scaleY + this.regY;
		if(this.target && this.target.status === "death"){
			this.target = null;
		}

		this.hero.hideRange();
		if(event.nativeEvent.button == 2){
			if(this.target){
				this.hero.attack(this.target);
			}else{
				if(x >= 0 && x <= this.width && y >= 0 && y <= this.height){
					this.hero.move(x,y);
				}
				this.setCommand("move");
			}
		}else if(event.nativeEvent.button == 0){
			if(this.command === "move"){
			}else if(this.command === "attack"){
				if(this.target){
					this.hero.attack(this.target);
					this.setCommand("move");
				}else{
					if(x >= 0 && x <= this.width && y >= 0 && y <= this.height){
						this.hero.moveAttack(x,y);
						this.setCommand("move_attack");						
					}
				}
			}
		}
	}, this);

	document.onkeydown = function(event){
		switch(event.keyCode){
			case 27://esc
				this.setCommand("move");
				break;
			case 68://d
				this.setCommand("assemble");
				break;
			case 83://s
				this.setCommand("stop");
				break;
			case 65://a
				this.setCommand("attack");
				this.hero.showRange();
				break;
			case 70:
				this.toggleFollowerShipType();
				break;
			case 81://q
				this.hero.useSkill('q', this.mouse_position);
				break;
			case 87://w
				this.hero.useSkill('w', this.mouse_position);
				break;
			case 69://e
				this.hero.useSkill('e', this.mouse_position);
				break;
			case 82://r
				this.hero.useSkill('r', this.mouse_position);
				break;
		}
		this.update();
	}.bind(this);

	document.addEventListener("mousewheel", function(event){
		this.game.setScale(event.wheelDelta/1000);
		this.game.viewport();
	}.bind(this), false);
	document.addEventListener("DOMMouseScroll", function(event){
		this.game.setScale(event.detail/100);
	}.bind(this), false);
}

Unit_Stage.prototype.initContainer = function(){
	this.unit_container = new createjs.Container();
	this.ui_container = new createjs.Container();
	this.effect_container = new createjs.Container();
	this.addChild(this.unit_container, this.ui_container, this.effect_container);
}

Unit_Stage.prototype.toggleFollowerShipType = function(){
	switch(this.followership_type){
		case "annihilate":
			this.followership_type = "follow";
			this.unit_container.children.forEach(function(unit){
				if(unit.type === "follow"){
					unit.order = this.hero.order;
				}
			},this);
			break;
		case "follow":
			this.followership_type = "annihilate";
			this.unit_container.children.forEach(function(unit){
				if(unit.type === "follow"){
					unit.order = {action:"annihilate", map:unit.findPath({x:unit.x,y:unit.y})};
				}
			},this);
			break;
	}
}

Unit_Stage.prototype.addHero = function(hero){
	this.hero = hero;
	this.unit_container.addChild(this.hero);
}

Unit_Stage.prototype.addFollower = function(follower){
	this.unit_container.addChild(follower);
	follower.order = this.hero.order;
}

Unit_Stage.prototype.addUnit = function(unit, x, y){
	this.unit_container.addChild(unit);
}

Unit_Stage.prototype.removeUnit = function(target){
	this.minimap.removeMinimapBlock(target);
	this.unit_container.removeChild(target);
}

Unit_Stage.prototype.setCommand = function(type){
	switch(type){
		case "attack":
			this.command = "attack";
			this.canvas.classList.add("attack");
			this.hero.showRange();
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

Unit_Stage.prototype.setCanvasSize = function(width, height){
	this.canvas.width = width;
	this.canvas.height = height;
}

Unit_Stage.prototype.getEffect = function(){
	return this.effect;
}