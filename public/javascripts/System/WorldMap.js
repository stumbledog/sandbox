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
	this.height = 360;

	this.frame = new createjs.Shape();
	this.chapter_container = new createjs.Container();
	this.chapter_container.x = 6;
	this.chapter_container.y = 50;

	this.initAct(builder);

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

	var level_detail_container = new createjs.Container();
	level_detail_container.visible = false;
	level_detail_container.name = "detail";
	var level_detail_border = new createjs.Shape();
	level_detail_border.graphics.s("#000").f("#fff").dr(0,0,150,80);
	var level_detail_text = new createjs.Text("","12px Arial","#000");
	level_detail_text.name = "text";
	level_detail_text.x = level_detail_text.y = 10;
	level_detail_container.addChild(level_detail_border, level_detail_text);

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

			act.addEventListener("mousedown", function(event){
				this.chapter_container.sortChildren(function(obj1, obj2){
					if(obj1.name === "detail"){
						return 1;
					}else if(obj2.name === "detail"){
						return -1;
					}else if(obj1.name === act.name){
						return 1
					}else if(obj2.name === act.name){
						return -1;
					}else{
						return 0;
					}
				});
				this.stage.update();
			}.bind(this));

			var container = new createjs.Container();
			container.name = map.act;
			this.chapter_container.addChild(container);
		}

		var chapter_container = this.chapter_container.getChildByName(map.act);

		var chapter = new createjs.Container();
		chapter.y = chapter_container.children.length * 30;

		var chapter_border = new createjs.Shape();
		chapter_border.graphics.s("#000").f("#A7A37E").dr(0,0,300,30);
		chapter_border.name = "border";
		
		var chapter_name = new OutlineText(map.name, "14px Arial", "#fff", "#000", 3);
		chapter_name.x = 10;
		chapter_name.y = 8;
		chapter.addChild(chapter_border, chapter_name);

		var chapter_difficulty = new createjs.Container();
		var difficulty_level = ["I", "II", "III", "IV", "V", "VI", "VII"];
		difficulty_level.forEach(function(level, index){
			var level_container = new createjs.Container();
			level_container.cursor = "pointer";
			level_container.x = 22 * index + 142;
			level_container.y = 5;
			level_container.addEventListener("rollover", function(event){
				level_detail_container.visible = true;
				level_detail_container.x = 22 * index -9;
				level_detail_container.y = map.chapter < 6 ? 30 * (map.chapter - 1) + 5 : 30 * (map.chapter - 1) -55;
				level_detail_text.text = Math.round(100 * Math.pow(2,index))+"% Health\n"+Math.round(100 * Math.pow(1.6,index))+"% Damage\n" + 100 * index + "% Extra Gold Bonus\n" + 100 * index + "% Extra XP Bonus\n" + 100 * index + "% Item Drop Bonus";
				level_container.getChildByName("border").graphics._fill.style = "#8E2800";
				this.stage.update();
			}.bind(this));

			level_container.addEventListener("rollout", function(event){
				level_detail_container.visible = false;
				level_container.getChildByName("border").graphics._fill.style = "#B64926";
				this.stage.update();
			}.bind(this));

			level_container.addEventListener("mousedown", function(event){
				var form = $('<form>', {
			        action: '/',
			        method:"POST"
				}).append($('<input>', {
					name: 'act',
					value: map.act,
					type: 'hidden'
				})).append($('<input>', {
					name: 'chapter',
					value: map.chapter,
					type: 'hidden'
				})).append($('<input>', {
					name: 'difficulty_level',
					value: index,
					type: 'hidden'
				}));
			    form.submit();
			}.bind(this));			

			var level_text = new createjs.Text(level, "12px Arial", "#fff");
			level_text.x = 10;
			level_text.y = 4;
			level_text.textAlign = "center";
			var level_border = new createjs.Shape();
			level_border.name = "border";
			level_border.graphics.s("#ccc").f("#B64926").dr(0,0,20,20);
			level_container.addChild(level_border, level_text);
			chapter.addChild(level_container);
		}, this);

		chapter_container.addChild(chapter);
	}, this);

	this.chapter_container.sortChildren(function(obj1, obj2){
		if(obj1.name === 1){
			return 1
		}else if(obj2.name === 1){
			return -1;
		}else{
			return 0;
		}
	});

	this.chapter_container.addChild(level_detail_container);
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