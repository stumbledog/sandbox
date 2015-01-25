function UI(stage){
	this.initialize(stage);
}

UI.prototype.initialize = function(stage){
	this.game_stage = stage;

	this.canvas = document.getElementById("ui");
	this.canvas.width = stage.canvas.width;
	this.canvas.height = stage.canvas.height;
	
	this.stage = new createjs.Stage(this.canvas);
	this.stage.enableMouseOver();
	this.stage.scaleX = this.stage.scaleY = 1;

	this.cursor = new Cursor();
	this.game = Game.getInstance();
	this.hero = this.game.getHero();
	this.target = null;

	this.offsetX = this.offsetY = 0;

	this.stage.addChild(this.cursor);
	this.stage.nextStage = stage;
	stage.enableMouseOver();
	this.initEvent();
}

UI.prototype.initEvent = function(){
	var self = this;
	this.stage.addEventListener("stagemousemove", function(event){
		self.cursor.x = event.stageX;
		self.cursor.y = event.stageY;
		self.stage.update();
		//this.game.mouseMove(event);
		//self.stage.update();
		/*
		if(event.stageX > window.innerWidth-100){
			move_right = true;
		}else{
			move_right = false;
		}

		if(event.stageX < 100 - offsetX){
			move_left = true;
		}else{
			move_left = false;
		}
		*/
	});
	
	this.stage.on("stagemousedown", function(event){
		if(this.target && this.target.status === "death"){
			this.target = null;
		}
		if(event.nativeEvent.button == 2){
			if(this.target){
				this.hero.setTarget(this.target);
			}else{
				this.hero.move(event.stageX - this.offsetX, event.stageY - this.offsetY);
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
					this.hero.moveAttack(event.stageX,event.stageY);
					this.setCommand("move_attack");
				}
			}
		}
		this.stage.update();
	}, this);

	document.onkeydown = function(event){
		console.log(event.keyCode);
		switch(event.keyCode){
			case 27://esc
				self.setCommand("move");
				break;
			case 87://w
				break;
			case 68://d
				self.setCommand("assemble");
				break;
			case 83://s
				self.setCommand("stop");
				break;
			case 65://a
				self.setCommand("attack");
				break;
		}
		self.stage.update();
	}

	document.addEventListener("mousewheel", function(event){
		this.game.setScale(event.wheelDelta);
	}.bind(this), false);
}

UI.prototype.setCommand = function(type){
	switch(type){
		case "attack":
			this.command = "attack";
			this.cursor.attack();
		break;
		case "move":
			this.command = "move";
			this.cursor.move();
		break;
		case "stop":
			this.command = "move";
			this.cursor.move();
			this.hero.stop();
		break;
		case "move_attack":
			this.command = "move_attack"
			this.cursor.move();
	}
}

UI.prototype.setCanvasSize = function(width, height){
	this.canvas.width = width;
	this.canvas.height = height;
}