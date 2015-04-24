function TopMenu(){
	this.initialize();
}

TopMenu.prototype = new createjs.Container();
TopMenu.prototype.constructor = TopMenu;
TopMenu.prototype.container_initialize = TopMenu.prototype.initialize;

TopMenu.prototype.initialize = function(){
	this.container_initialize();
	this.game = Game.getInstance();

	this.difficulty = this.game.getDifficultyLevel();
	this.act = this.game.getAct();
	this.chapter = this.game.getChapter();

	var base = new createjs.Container();
	base.cursor = "pointer";
	var border = new createjs.Shape();
	border.graphics.s("#000").f("#ccc").rr(0,0,200,30,5);
	var text = new createjs.Text("Back to basecamp","bold 12px Arial", "#000");
	text.x = 100;
	text.y = 15;
	text.textAlign = "center";
	text.textBaseline = "middle";
	base.addChild(border, text);
	this.addChild(base);
	base.addEventListener("mousedown", function(){
		var form = $('<form>', {
					action: '/',
					method:"GET"
				});
	    form.submit();
	});

	var base = new createjs.Container();
	base.cursor = "pointer";
	base.y = 30;
	var border = new createjs.Shape();
	border.graphics.s("#000").f("#ccc").rr(0,0,200,30,5);
	var text = new createjs.Text("Restart this stage","bold 12px Arial", "#000");
	text.x = 100;
	text.y = 15;
	text.textAlign = "center";
	text.textBaseline = "middle";
	base.addChild(border, text);
	this.addChild(base);

	base.addEventListener("mousedown", function(){
		var form = $('<form>', {
					action: '/',
					method:"POST"
				}).append($('<input>', {
					name: 'act',
					value: this.act,
					type: 'hidden'
				})).append($('<input>', {
					name: 'chapter',
					value: this.chapter,
					type: 'hidden'
				})).append($('<input>', {
					name: 'difficulty_level',
					value: this.difficulty,
					type: 'hidden'
				}));
		form.submit();
	}.bind(this));
}


TopMenu.prototype.open = function(){
	this.game.getTopMenuStage().addChild(this);
	this.stage.open();
}

TopMenu.prototype.close = function(){
	this.stage.close();
}

TopMenu.prototype.toggle = function(){
	if(this.act && this.chapter){
		if(this.stage && this.stage.canvas.style.zIndex){
			this.close();
		}else{
			this.open();
		}
	}
}