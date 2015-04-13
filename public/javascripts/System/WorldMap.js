function WorldMap(builder){
	this.worldmap_initialize(builder);
}

WorldMap.prototype = new createjs.Container();
WorldMap.prototype.constructor = WorldMap;
WorldMap.prototype.container_initialize = WorldMap.prototype.initialize;

WorldMap.prototype.worldmap_initialize = function(builder){
	this.container_initialize();
	this.game = Game.getInstance();
	this.user = this.game.getUser();
	this.loader = this.game.getLoader();

	this.width = 310;
	this.height = 410;

	this.frame = new createjs.Shape();
	this.chapter_container = new createjs.Container();
	this.chapter_container.x = 6;
	this.chapter_container.y = 50;

	this.initAct(builder);
/*
	builder.forEach(function(map, index){
		var container = new createjs.Container();
		var border = new createjs.Shape();
		border.graphics.s("#").f("#").rr(0,0,300,40,5);
		container.addChild(border);
		container.y = index * 40;
		this.map_container.addChild(container);
	}, this);
*/

	this.close_button = new createjs.Container();
	this.close_button.x = this.width - 35;
	this.close_button.y = 20;
	this.close_button.cursor = "pointer";
	this.close_button.addEventListener("mousedown", this.close.bind(this));

	this.close_button_bg = new createjs.Shape();
	this.close_button_bg.graphics.s("#000").ss(1).f("#8E2800").dr(0,0,30,30);

	this.close_icon = new createjs.Shape();
	this.close_icon.graphics.s("#FFF0A5").ss(3).mt(5,5).lt(25,25).mt(5,25).lt(25,5);

	this.close_button.addChild(this.close_button_bg, this.close_icon);
	this.addChild(this.frame, this.chapter_container, this.act_container, this.close_button);
}

WorldMap.prototype.initAct = function(builder){
	this.act_container = new createjs.Container();
	this.act_container.x = 20;
	this.act_container.y = 20;
	builder.forEach(function(map){
		if(!this.act_container.getChildByName(map.act)){
			var act = new createjs.Container();
			act.cursor = "pointer";
			act.name = map.act;
			act.x = (map.act - 1) * 50;
			var border = new createjs.Shape();
			border.name = "border";
			border.graphics.s("#000").f("#284907").dr(0,0,46,30);
			var text = new OutlineText("Act " + map.act, "14px Arial", "#fff", "#000", 3);
			text.x = 23;
			text.y = 8;
			text.textAlign("center");
			act.addChild(border, text);
			this.act_container.addChild(act);

			act.addEventListener("rollover", function(event){
				act.getChildByName("border").graphics._fill.style = "#5C832F";
				this.stage.update();
			}.bind(this));

			act.addEventListener("rollout", function(event){
				act.getChildByName("border").graphics._fill.style = "#284907";
				this.stage.update();
			}.bind(this));

			var container = new createjs.Container();
			container.name = map.act;
			this.chapter_container.addChild(container);
		}

		var chapter_container = this.chapter_container.getChildByName(map.act);

		var chapter = new createjs.Container();
		chapter.cursor = "pointer";
		chapter.y = chapter_container.children.length * 30;

		chapter.addEventListener("rollover", function(event){
			chapter.getChildByName("border").graphics._fill.style = "#E6E2AF";
			this.stage.update();
		}.bind(this));

		chapter.addEventListener("rollout", function(event){
			chapter.getChildByName("border").graphics._fill.style = "#A7A37E";
			this.stage.update();
		}.bind(this));

		var chapter_border = new createjs.Shape();
		chapter_border.graphics.s("#000").f("#A7A37E").dr(0,0,300,30);
		chapter_border.name = "border";
		
		var chapter_name = new OutlineText(map.name, "14px Arial", "#fff", "#000", 3);
		chapter_name.x = 10;
		chapter_name.y = 8;

		var chapter_difficulty = new createjs.Container();
	
		if(map.act !== 1 || map.chapter !== 1){
			var difficulty_level = ["I", "II", "III", "IV", "V", "VI", "VII"];

			difficulty_level.forEach(function(level){
				console.log(level);
			}, this);			
		}


		chapter.addChild(chapter_border, chapter_name);
		chapter_container.addChild(chapter);
	}, this);
}

WorldMap.prototype.open = function(){
	this.game.getLeftMenuStage().addChild(this);
	this.stage.canvas.width = this.width;
	this.stage.canvas.height = this.height;
	this.user.action = this;
	this.stage.open();
}

WorldMap.prototype.close = function(){
	this.user.action = null;
	this.stage.close();
}