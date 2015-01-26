var Game = (function(){

	var instance;

	function init(){
		var ui_stage, map_stage, loader, hero;
		var offsetX = offsetY = 0;
		var move_top = move_right = move_down = move_left = false;
		var map_width = 16 * 32, map_height  = 14 * 32;
		var unit_coordinates;
		var scale = 1;

		var unit_stage;

		//stage.scaleX = stage.scaleY = scale;

		window.onresize = function(){
			canvas.width = map_width;
			canvas.height = map_height;
			ui_stage.setCanvasSize(map_width, map_height);
		};

		var manifest = [
			{src:"assets/Graphics/Characters/01 - Hero.png", id:"hero"},
			{src:"assets/Graphics/Characters/23 - Soldier.png", id:"soldier"},
			{src:"assets/Graphics/Characters/29 - Monster.png", id:"monster29"},
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleLoadComplete);
		loader.loadManifest(manifest);

		function handleLoadComplete(){
			initMap();
			initUI();

			createHero();
			//createUnits();
			createEnemy();
		}

		function initUI(){
			ui_stage = new UI_Stage(map_width * scale, map_height * scale, 14);
		}

		function initContainer(){
			unit_container = new createjs.Container();
			effect_container = new createjs.Container();
			stage.addChild(unit_container, effect_container);
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

			map_stage = new Map_Stage({
				maps:[{
					tiles:tiles_A, 
					tile_map:tile_map_A, 
					file:"assets/Graphics/Tilesets/A5/Exterior_Forest_TileA5.png", 
					file_id:"A5/Exterior_Forest_TileA5",
					block:false
					},{
					tiles:tiles_B, 
					tile_map:tile_map_B, 
					file:"assets/Graphics/Tilesets/E/Exterior_Walls_TileE.png", 
					file_id:"E/Exterior_Walls_TileE",
					block:true
				}],
				width:32*16,
				height:32*14,
				rows:14
			});
			blocks = map_stage.getBlock();
		}

		function createHero(){
			ui_stage.addHero(new Hero("hero", 0),  0*16+8, 0*16+8);
		}

		function createUnits(){
			var unit = new Follower("soldier", 0);
			unit.x = 1 * 16 + 8;
			unit.y = 0 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 1);
			unit.x = 1 * 16 + 8;
			unit.y = 1 * 16 + 8;
			unit_container.addChild(unit);
			var unit = new Follower("soldier", 2);
			unit.x = 1 * 16 + 8;
			unit.y = 2 * 16 + 8;
			unit_container.addChild(unit);/*
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
			unit_container.addChild(unit);*/
		}

		function createEnemy(){
			ui_stage.addUnit(new Monster("monster29",0),  9*16+8, 0*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 10*16+8, 1*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 11*16+8, 2*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 15*16+8, 3*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 14*16+8, 2*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 13*16+8, 1*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 16*16+8, 0*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 17*16+8, 1*16+8);
			ui_stage.addUnit(new Monster("monster29",0), 18*16+8, 2*16+8);
		}

		function assembleCompany(){

		}

		function tick(){
			if(!unit_coordinates){
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
			scrollScreen:function(direction){

			},
			findPath:function(self, starting, destination, avoid_enemy){
				var new_blocks = [];
				blocks.forEach(function(row){
					new_blocks.push(row.slice(0));
				});

				ui_stage.getUnits().forEach(function(unit){
					if(avoid_enemy && unit.id !== self.id){
						new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)] = 1;
					}else if(!avoid_enemy && unit.team === self.team && unit.id !== self.id){
						new_blocks[parseInt(unit.y/16)][parseInt(unit.x/16)] = 1;
					}
				});

				return PathFinder.findPath(new_blocks, starting, destination);
			},
			getHero:function(){
				return hero;
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
			setTarget:function(unit){
				target = unit;
			},
			unsetTarget:function(unit){
				if(target.id === unit.id){
					target = null;
				}
			},
			findNeighbor:function(self, x, y){
				var new_blocks = [];
				blocks.forEach(function(row){
					new_blocks.push(row.slice(0));
				});
				ui_stage.getUnits().forEach(function(unit){
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
			},
			getMapStage:function(){
				return map_stage;
			},
			getUIStage:function(){
				return ui_stage;
			},
			setScale:function(delta){
				scale += delta/100;
				scale = scale < 1 ? 1 :scale > 3 ? 3 : scale;
				console.log(scale);
				stage.scaleX = stage.scaleY = scale;
				canvas.width = map_width * scale;
				canvas.height = map_height * scale;
				stage.update();
				map_stage.setScale(scale);
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