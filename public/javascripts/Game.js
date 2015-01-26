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

		window.onresize = function(){
			canvas.width = map_width;
			canvas.height = map_height;
			ui_stage.setCanvasSize(map_width, map_height);
		};

		var manifest = [
			{src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"},
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

		function initMap(){
			var tiles_A = [
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
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
			ui_stage.addFollower(new Follower("soldier",0),  1*16+8, 0*16+8);
			ui_stage.addFollower(new Follower("soldier",1),  1*16+8, 1*16+8);
			ui_stage.addFollower(new Follower("soldier",2),  1*16+8, 2*16+8);
			ui_stage.addFollower(new Follower("soldier",3),  1*16+8, 3*16+8);
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

		function tick(){
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
		}

		return {
			getLoader:function(){
				return loader;
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
			getMapStage:function(){
				return map_stage;
			},
			getUIStage:function(){
				return ui_stage;
			},
			setScale:function(delta){
				scale += delta/100;
				scale = scale < 1 ? 1 :scale > 3 ? 3 : scale;
				map_stage.scaleX = map_stage.scaleY = scale;
				ui_stage.scaleX = ui_stage.scaleY = scale;
				map_stage.update();
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