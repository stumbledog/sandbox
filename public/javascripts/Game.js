var Game = (function(){

	var instance;

	function init(){
		var stage, canvas, loader, hero, cursor, blocks;
		var map_container, block_container, enemy_container, unit_container, hero_container, effect_container, health_bar_container, cursor_container;
		var offsetX = offsetY = 0;
		var move_top = move_right = move_down = move_left = false;
		var command = "move";
		var map_width, map_height;

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
			{src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"},
			{src:"assets/Graphics/Characters/01 - Hero.png", id:"hero"},
			{src:"assets/Graphics/Characters/23 - Soldier.png", id:"soldier"},
			{src:"assets/Graphics/Characters/29 - Monster.png", id:"monster29"},
			{src:"assets/Graphics/Tilesets/A5/Exterior_Forest_TileA5.png", id:"mapA"},
			{src:"assets/Graphics/Tilesets/B/Exterior_Forest_TileB.png", id:"mapB"},
			{src:"assets/Graphics/Tilesets/A2/Exterior_Forest_TileA2.png", id:"EFTA2"},
			{src:"assets/Graphics/Tilesets/E/Exterior_Walls_TileE.png", id:"E2"},
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
			createUnits();
			createEnemy();
			renderHealthBar();

			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(120);
		}

		function initContainer(){
			map_container = new createjs.Container();
			block_container = new createjs.Container();
			enemy_container = new createjs.Container();
			unit_container = new createjs.Container();
			hero_container = new createjs.Container();
			effect_container = new createjs.Container();
			health_bar_container = new createjs.Container();
			cursor_container = new createjs.Container();
			stage.addChild(map_container, block_container, enemy_container, unit_container, hero_container, effect_container, health_bar_container, cursor_container);
		}

		function initEventListener(){
			stage.on("stagemousedown", function(event){
				if(event.nativeEvent.button == 2){
					hero.move(event.stageX - offsetX,event.stageY);
/*					unit_container.children.forEach(function(unit){
						unit.move(event.stageX,event.stageY);
					});*/
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
					move_right = true;
				}else{
					move_right = false;
				}

				if(event.stageX < 100){
					move_left = true;
				}else{
					move_left = false;
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
						setCommand("assemble");
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
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,1,2,1,1,2,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,2,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,2,1,2,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,2,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,1,2,1,1,2,1,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,2,1,1,1,1,1,1,1,1,0],
				[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			];

			var tile_map_A = [
				[32,0,32,32],
				[160,0,32,32],
			];

			var tiles_B = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,2,3,3,3,3,3,3,3,3,3,3,4,0,0],
				[0,0,1,0,0,0,0,0,0,0,0,0,0,7,0,0],
				[0,0,1,0,2,3,3,3,3,3,3,4,0,7,0,0],
				[0,0,1,0,1,0,0,0,0,0,0,7,0,7,0,0],
				[0,0,1,0,1,0,2,3,3,4,0,7,0,7,0,0],
				[0,0,1,0,1,0,1,0,0,7,0,7,0,7,0,0],
				[0,0,1,0,1,0,1,0,0,0,0,7,0,7,0,0],
				[0,0,1,0,1,0,5,3,3,3,3,6,0,7,0,0],
				[0,0,1,0,1,0,0,0,0,0,0,0,0,7,0,0],
				[0,0,1,0,5,3,3,3,3,3,3,3,3,6,0,0],
				[0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			];

			var tile_map_B = [
				[0,160,32,32],
				[0,128,32,32],
				[32,128,32,32],
				[64,128,32,32],
				[0,192,32,32],
				[64,192,32,32],
				[64,160,32,32],
			];

			map_container.addChild(new Map(loader.getResult("mapA"), tiles_A, tile_map_A));
			block_container.addChild(new Map(loader.getResult("E2"), tiles_B, tile_map_B));

			setBlocks(tiles_B);
		}

		function setBlocks(tiles){
			var rows = tiles.length;
			var cols = tiles[0].length;

			blocks = [];

			tiles.forEach(function(row, y){
				var arr = [];
				row.forEach(function(cell, x){
					if(y === 0 || y === rows - 1 || x === 0 || x === cols - 1){
						arr.push(1);
					}else{
						arr.push(cell);
					}
				});
				blocks.push(arr);
			});
		}

		function createHero(){
			hero = new Hero("hero", 0);
			hero.x = 48;
			hero.y = 48;
			hero_container.addChild(hero);
		}

		function createUnits(){
			var unit = new Unit("soldier", 0);
			unit.x = 80;
			unit.y = 48;
			unit_container.addChild(unit);/*
			var unit = new Unit("soldier", 1);
			unit.x = 112;
			unit.y = 48;
			unit_container.addChild(unit);
			var unit = new Unit("soldier", 2);
			unit.x = 144;
			unit.y = 48;
			unit_container.addChild(unit);
			var unit = new Unit("soldier", 3);
			unit.x = 176;
			unit.y = 48;
			unit_container.addChild(unit);*/
		}

		function createEnemy(){
			var monster = new Monster("monster29",0);
			monster.x = 120;
			monster.y = 48;
			enemy_container.addChild(monster);
			var monster = new Monster("monster29",1);
			monster.x = 48;
			monster.y = 330;
			enemy_container.addChild(monster);
		}

		function renderHealthBar(){
			enemy_container.children.forEach(function(enemy){
				console.log(enemy.health);
			});
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

		function assembleCompany(){

		}

		function tick(){
			if(move_right){
				offsetX--;
				stage.children.forEach(function(container, index){
					if(index !== 6){
						container.x = offsetX;
					}
				});
			}else if(move_left){
				if(offsetX<0){
					offsetX++;
					stage.children.forEach(function(container, index){
						if(index !== 6){
							container.x = offsetX;
						}
					});					
				}
			}
			hero.tick();
			unit_container.children.forEach(function(unit){
				unit.tick();
			});

			stage.update();
		}

		return {
			getStage:function(){
				return stage;
			},
			getLoader:function(){
				return loader;
			},
			getEffectContainer:function(){
				return effect_container;
			},
			findPath:function(starting, destination){
				return PathFinder.findPath(blocks, starting, destination);
			},
			getUnits:function(){
				return unit_container.children;
			},
			getEnemies:function(){
				return enemy_container.children;
			}
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