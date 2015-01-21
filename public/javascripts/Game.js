var Game = (function(){

	var instance;

	function init(){
		var stage, canvas, loader, hero, cursor, blocks;
		var map_container, block_container, enemy_container, unit_container, hero_container, effect_container, health_bar_container, cursor_container;
		var offsetX = offsetY = 0;
		var move_top = move_right = move_down = move_left = false;
		var command = "move";
		var map_width = 16 * 32, map_height  = 14 * 32;
		var heroes = [];
		var unit_coordinates;

		canvas = document.getElementById("gameCanvas");
		canvas.width = map_width;
		canvas.height = map_height;

		stage = new createjs.Stage(canvas);
		stage.enableMouseOver(10);
//		stage.scaleX = stage.scaleY=2;

		window.onresize = function(){
			canvas.width = map_width;
			canvas.height = map_height;
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
			//createUnits();
			createEnemy();
			
			createjs.Ticker.addEventListener("tick", tick);
			createjs.Ticker.setFPS(60);
		}

		function initContainer(){
			map_container = new createjs.Container();
			block_container = new createjs.Container();
			//enemy_container = new createjs.Container();
			unit_container = new createjs.Container();
			//hero_container = new createjs.Container();
			effect_container = new createjs.Container();
			//health_bar_container = new createjs.Container();
			cursor_container = new createjs.Container();
			//stage.addChild(map_container, block_container, enemy_container, unit_container, hero_container, effect_container, health_bar_container, cursor_container);
			stage.addChild(map_container, block_container, unit_container, effect_container, cursor_container);
		}

		function initEventListener(){
			stage.on("stagemousedown", function(event){
				if(event.nativeEvent.button == 2){
					heroes.forEach(function(hero){
						hero.move(event.stageX - offsetX,event.stageY - offsetY);
					});
					setCommand("move");
				}else if(event.nativeEvent.button == 0){
					if(command === "move"){
						console.log("select");
					}else if(command === "attack"){
						hero.moveAttack(event.stageX,event.stageY);
						setCommand("move_attack");
					}
				}
			});

			stage.on("stagemousemove", function(event){
				cursor.x = event.stageX;
				cursor.y = event.stageY;
				//console.log(event);
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
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
				var arr1 = [];
				var arr2 = [];
				row.forEach(function(cell, x){
//					if(y === 0 || y === rows - 1 || x === 0 || x === cols - 1){
//						arr.push(1);
//					}else{
						arr1.push(cell,cell);
						arr2.push(cell,cell);
//					}
				});
				blocks.push(arr1);
				blocks.push(arr2);
			});
		}

		function createHero(){
			hero = new Hero("hero", 0);
			hero.x = 0 * 16 + 8;
			hero.y = 0 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);/*
			hero = new Hero("hero", 0);
			hero.x = 0 * 16 + 8;
			hero.y = 1 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 0 * 16 + 8;
			hero.y = 2 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 0 * 16 + 8;
			hero.y = 3 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 1 * 16 + 8;
			hero.y = 0 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 1 * 16 + 8;
			hero.y = 1 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 1 * 16 + 8;
			hero.y = 2 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 1 * 16 + 8;
			hero.y = 3 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 2 * 16 + 8;
			hero.y = 0 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 2 * 16 + 8;
			hero.y = 1 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 2 * 16 + 8;
			hero.y = 2 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 2 * 16 + 8;
			hero.y = 3 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 3 * 16 + 8;
			hero.y = 0 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 3 * 16 + 8;
			hero.y = 1 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 3 * 16 + 8;
			hero.y = 2 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);
			hero = new Hero("hero", 0);
			hero.x = 3 * 16 + 8;
			hero.y = 3 * 16 + 8;
			heroes.push(hero);
			unit_container.addChild(hero);*/
		}

		function createUnits(){
			var unit = new Follower("soldier", 0);
			unit.x = 0 * 16 + 8;
			unit.y = 0 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 1);
			unit.x = 1 * 16 + 8;
			unit.y = 1 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 2);
			unit.x = 2 * 16 + 8;
			unit.y = 2 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 3);
			unit.x = 4 * 16 + 8;
			unit.y = 1 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 0);
			unit.x = 5 * 16 + 8;
			unit.y = 2 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 1);
			unit.x = 6 * 16 + 8;
			unit.y = 3 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 2);
			unit.x = 8 * 16 + 8;
			unit.y = 2 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 3);
			unit.x = 7 * 16 + 8;
			unit.y = 1 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 3);
			unit.x = 6 * 16 + 8;
			unit.y = 0 * 16 + 8;
			unit_container.addChild(unit);
		}

		function createEnemy(){
			var monster = new Monster("monster29",0);
			monster.x = 9*16+8;
			monster.y = 0*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 10*16+8;
			monster.y = 1*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 11*16+8;
			monster.y = 2*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 15*16+8;
			monster.y = 3*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 14*16+8;
			monster.y = 2*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 13*16+8;
			monster.y = 1*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 16*16+8;
			monster.y = 0*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 17*16+8;
			monster.y = 1*16+8;
			unit_container.addChild(monster);
			var monster = new Monster("monster29",0);
			monster.x = 18*16+8;
			monster.y = 2*16+8;
			unit_container.addChild(monster);
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
				case "move_attack":
					command = "move_attack"
					cursor.move();
			}
		}

		function assembleCompany(){

		}

		function tick(){
			if(!unit_coordinates){
				console.log("init coordinates");
				unit_coordinates = [];
				for(var i=0;i<blocks.length;i++){
					unit_coordinates.push([]);
				}
				unit_container.children.forEach(function(unit){
					unit_coordinates[parseInt(unit.y/16)][parseInt(unit.x/16)] = unit;
				});
			}

			unit_container.sortChildren(function(obj1, obj2){return obj1.y>obj2.y?1:-1;});

			if(move_right && window.innerWidth - offsetX < canvas.width){
				offsetX-=10;
				stage.children.forEach(function(container, index){
					if(index !== 4){
						container.x = offsetX;
					}
				});
			}else if(move_left && offsetX<0){
				offsetX+=10;
				stage.children.forEach(function(container, index){
					if(index !== 4){
						container.x = offsetX;
					}
				});
			}
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
			findPath:function(self, starting, destination, avoid_enemy){
				var new_blocks = [];
				blocks.forEach(function(row){
					new_blocks.push(row.slice(0));
				});
				if(avoid_enemy){
					unit_container.children.forEach(function(unit){
						if(unit.team !== self.team){
							new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)] = 1;
						}
					});					
				}
				return PathFinder.findPath(new_blocks, starting, destination);
			},
			getUnits:function(){
				return unit_container.children;
			},
			removeUnit:function(target){
				unit_container.removeChild(target);
			},
			getEnemies:function(self){
				return unit_container.children.filter(function(unit){return self.team !== unit.team && unit.status !== "death";});
			},
			setTarget:function(target){
				hero.setTarget(target);
			},
			findNeighbor:function(self, x, y){
				var new_blocks = [];
				blocks.forEach(function(row){
					new_blocks.push(row.slice(0));
				});
				unit_container.children.forEach(function(unit){
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
			},
			getUnitCoordinates:function(){
				return unit_coordinates;
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