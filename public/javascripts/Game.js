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
			createjs.Ticker.setFPS(30);
		}

		function initContainer(){
			map_container = new createjs.Container();
			block_container = new createjs.Container();
			unit_container = new createjs.Container();
			cursor_container = new createjs.Container();
			stage.addChild(map_container, block_container ,unit_container, cursor_container);
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
				[1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			];

			var tile_map_A = [
				[32,0,32,32],
				[160,0,32,32],
			];

			var tiles_B = [
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,1,2,1,2,1,2,1,2,1,2,1,2,0,0],
				[0,0,3,4,3,4,3,4,3,4,3,4,3,4,0,0],
				[0,0,1,2,0,0,0,0,0,0,0,0,1,2,0,0],
				[0,0,3,4,0,0,0,0,0,0,0,0,3,4,0,0],
				[0,0,1,2,0,0,1,2,1,2,0,0,1,2,0,0],
				[0,0,3,4,0,0,3,4,3,4,0,0,3,4,0,0],
				[0,0,1,2,0,0,1,2,0,0,0,0,1,2,0,0],
				[0,0,3,4,0,0,3,4,0,0,0,0,3,4,0,0],
				[0,0,1,2,0,0,1,2,0,0,0,0,1,2,0,0],
				[0,0,3,4,0,0,3,4,0,0,0,0,3,4,0,0],
				[0,0,1,2,0,0,1,2,1,2,1,2,1,2,0,0],
				[0,0,3,4,0,0,3,4,3,4,3,4,3,4,0,0],
				[0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,3,4,0,0,0,0,0,0,0,0,0,0,0,0],
			];

			var tile_map_B = [
				[32,0,32,32],
				[64,0,32,32],
				[32,32,32,32],
				[64,32,32,32],
			];
			map_container.addChild(new Map(loader.getResult("mapA"), tiles_A, tile_map_A));
			block_container.addChild(new Map(loader.getResult("mapB"), tiles_B, tile_map_B));
		}

		function createHero(){
			hero = new Hero("hero", 0);
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

		return {
			getLoader:function(){
				return loader;
			},
			findPath:function(starting, destination){
				var paths = [];
				var blocks = [
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,1,2,1,2,1,2,1,2,1,2,1,2,0,0],
					[0,0,3,4,3,4,3,4,3,4,3,4,3,4,0,0],
					[0,0,1,2,0,0,0,0,0,0,0,0,1,2,0,0],
					[0,0,3,4,0,0,0,0,0,0,0,0,3,4,0,0],
					[0,0,1,2,0,0,1,2,1,2,0,0,1,2,0,0],
					[0,0,3,4,0,0,3,4,3,4,0,0,3,4,0,0],
					[0,0,1,2,0,0,1,2,0,0,0,0,1,2,0,0],
					[0,0,3,4,0,0,3,4,0,0,0,0,3,4,0,0],
					[0,0,1,2,0,0,1,2,0,0,0,0,1,2,0,0],
					[0,0,3,4,0,0,3,4,0,0,0,0,3,4,0,0],
					[0,0,1,2,0,0,1,2,1,2,1,2,1,2,0,0],
					[0,0,3,4,0,0,3,4,3,4,3,4,3,4,0,0],
					[0,0,1,2,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,3,4,0,0,0,0,0,0,0,0,0,0,0,0],
				];


				var costs = [];
				blocks.forEach(function(row){
					var arr = [];
					row.forEach(function(cell){
						arr.push(0);
					});
					costs.push(arr);
				});

				calcCost(parseInt(starting.x/32),parseInt(starting.y/32),0,1);

/*
				var string = "";
				costs.forEach(function(rows){
					rows.forEach(function(cell){
						string += cell+", ";
					});
					string += "\n";
				});
				console.log(string);
*/

				var path = getMinimum(parseInt(destination.x/32), parseInt(destination.y/32));

				path = path.filter(function(point){
					var x = point.x;
					var y = point.y;
					try{
						return ((blocks[y+1][x+1] || blocks[y-1][x+1]|| blocks[y+1][x-1] || blocks[y-1][x-1]) 
						&& (!blocks[y][x-1] && !blocks[y][x+1] && !blocks[y-1][x] && !blocks[y+1][x]));

					}catch(e){}
				});
				
				path.forEach(function(point){
					point.x = point.x*32+16;
					point.y = point.y*32+16;
				});

				path.push(destination);
				return path;


				function getMinimum(x,y, path){
					var min = costs[y][x];
					var point = {};

					[[-1,0],[1,0],[0,-1],[0,1]].forEach(function(offset){
						var i = offset[0];
						var j = offset[1];
						try{
							if(blocks[y+i][x+j]===0 && costs[y+i][x+j] < min){
								min = costs[y+i][x+j];
								point.x = x+j;
								point.y = y+i;
							}
						}catch(e){}
					});
					if(min === 1){
						if (point){
							return [point];
						}else{
							return [];
						}
					}else{
						if(point){
							return getMinimum(point.x,point.y, path).concat(point);
						}else{
							return getMinimum(point.x,point.y, path);
						}
					}
				}

				function calcCost(x,y,direction, new_cost){
					//console.log(0);
					if(y>=0 && y< blocks.length && x>=0 && x<blocks[y].length){
						if(!blocks[y][x]){
							var prev_cost = costs[y][x];
							if(!prev_cost || new_cost<prev_cost){
								costs[y][x] = new_cost;
								if(direction !== 1){
									calcCost(x-1,y,3,new_cost+1);
								}
								if(direction !== 2){
									calcCost(x,y+1,4,new_cost+1);
								}
								if(direction !== 3){
									calcCost(x+1,y,1,new_cost+1);
								}
								if(direction !== 4){
									calcCost(x,y-1,2,new_cost+1);
								}
							}
						}
					}
				}
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