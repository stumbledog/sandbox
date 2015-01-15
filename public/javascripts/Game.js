var Game = (function(){

	var instance;

	function init(){
		var stage, canvas, loader, hero, cursor;
		var map_container, block_container, unit_container, cursor_container;
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
			{src:"assets/Graphics/Tilesets/A5/Exterior_Forest_TileA5.png", id:"mapA"},
			{src:"assets/Graphics/Tilesets/B/Exterior_Forest_TileB.png", id:"mapB"},
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleLoadComplete);
		loader.loadManifest(manifest);

		function handleLoadComplete(){
			initContainer();
			initEventListener();
			initMouseCursor();
			initMap();
			createHero();

			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
		}

		function initContainer(){
			map_container = new createjs.Container();
			block_container = new createjs.Container();
			unit_container = new createjs.Container();
			cursor_container = new createjs.Container();
			stage.addChild(map_container, unit_container, cursor_container);
		}

		function initEventListener(){
			stage.on("stagemousedown", function(event){
				if(event.nativeEvent.button == 2){
					hero.move(event.stageX,event.stageY);
					setCommand("move");
				}else if(event.nativeEvent.button == 0){
					if(command === "move"){
						console.log("select");
					}else if(command === "attack"){
						hero.move(event.stageX,event.stageY);
						setCommand("move");
					}
				}
			});

			stage.on("stagemousemove", function(event){
				cursor.x = event.stageX;
				cursor.y = event.stageY;

				if(event.stageX > canvas.width-100){
					map_container.x --;
					unit_container.x--;
				}
			});

			document.onkeydown = function(event){
				console.log(event.keyCode);
				switch(event.keyCode){
					case 27://esc
						setCommand("move");
						break;
					case 87://w
						break;
					case 68://d
						break;
					case 83://s
						setCommand("stop");
						break;
					case 65://a
						setCommand("attack");
						break;
				}
			}
		}

		function initMouseCursor(){
			cursor = new Cursor(loader.getResult("icon"));
			cursor_container.addChild(cursor);
		}

		function initMap(){
			var tiles_A = [
				[1,1,1,1,1,1,1,1],
				[1,1,1,2,1,1,1,1],
				[1,1,2,1,1,2,1,1],
				[1,1,1,1,1,1,2,1],
				[1,1,1,1,1,1,1,1],
				[1,2,1,2,1,1,1,1],
				[1,1,1,1,1,2,1,1],
				[1,1,1,1,1,1,1,1],
			];

			var tile_map_A = [
				[32,0,32,32],
				[160,0,32,32],
			];

			var tiles_B = [
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,1,2,0,0,0,0],
				[0,0,3,4,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0],
			];

			var tile_map_B = [
				[32,0,32,32],
				[64,0,32,32],
				[32,32,32,32],
				[64,32,32,32],
			];
			map_container.addChild(new Map(loader.getResult("mapA"), tiles_A, tile_map_A));
			block_container.addChild(new Map(loader.getResult("mapB"), tiles_B, tile_map_B));
			console.log(map_container, block_container);
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
			hero.x = 128;
			hero.y = 128;
			unit_container.addChild(hero);
		}

		function setCommand(type){
			switch(type){
				case "attack":
					command = "attack";
					cursor.attack();
				break;
				case "move":
					command = "move";
					cursor.move();
				break;
				case "stop":
					command = "move";
					cursor.move();
					hero.stop();
				break;
			}
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