var Game = (function(){

	var instance;

	function init(){
		var stage, canvas, loader, hero, cursor, unit_container, cursor_container;
		var command = "move";
		canvas = document.getElementById("gameCanvas");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		stage = new createjs.Stage(canvas);

		stage.enableMouseOver(10);

		window.onresize = function(){
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		var manifest = [
			{src:"assets/Graphics/Characters/01 - Hero.png", id:"hero"},
			{src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"},
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleLoadComplete);
		loader.loadManifest(manifest);

		function handleLoadComplete(){
			initContainer();
			initEventListener();
			initMouseCursor();
			createHero();

			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(30);
		}

		function initContainer(){
			unit_container = new createjs.Container();
			cursor_container = new createjs.Container();
			stage.addChild(unit_container, cursor_container);
		}

		function initEventListener(){
			stage.on("stagemousedown", function(event){
				if(command === "move" && event.nativeEvent.button == 2){
					hero.move(event.stageX,event.stageY);
				}else if(command === "move" && event.nativeEvent.button == 0){
					console.log("select");
				}else if(command === "attack" && event.nativeEvent.button == 0){
					hero.move(event.stageX,event.stageY);
					command = "move";
				}
			});

			stage.on("stagemousemove", function(event){
				cursor.x = event.stageX;
				cursor.y = event.stageY;
			});

			document.onkeydown = function(event){
				switch(event.keyCode){
					case 87://w
						break;
					case 68://d
						break;
					case 83://s
						break;
					case 65://a
						command = "attack";
						break;
				}
			}
		}

		function initMouseCursor(){
			cursor = new createjs.Bitmap(loader.getResult("icon"));
			cursor.sourceRect = new createjs.Rectangle(245,102,13,14);
			cursor_container.addChild(cursor);
		}

		function createHero(){
			var spriteSheet = new createjs.SpriteSheet({
				images:[loader.getResult("hero")],
				frames:[
					[ 0, 1,24,32,0,12,16],
					[24, 1,24,32,0,12,16],
					[48, 1,24,32,0,12,16],
					[ 0,33,24,32,0,12,16],
					[24,33,24,32,0,12,16],
					[48,33,24,32,0,12,16],
					[ 0,65,24,32,0,12,16],
					[24,65,24,32,0,12,16],
					[48,65,24,32,0,12,16],
					[ 0,97,24,32,0,12,16],
					[24,97,24,32,0,12,16],
					[48,97,24,32,0,12,16],
				],
				animations:{
					front:{
						frames:[0,1,2],
						speed:0.3
					},
					left:{
						frames:[3,4,5],
						speed:0.3
					},
					right:{
						frames:[6,7,8],
						speed:0.3
					},
					back:{
						frames:[9,10,11],
						speed:0.3
					},
				}
			});

			hero = new Hero(spriteSheet);
			unit_container.addChild(hero);
		}

		function tick(){
			hero.tick();
			stage.update();
		}
	}

	return {
		getInstance:function(){
			if(!instance){
				instance = init();
			}
			return instance;
		}
	}
})();

Game.getInstance();