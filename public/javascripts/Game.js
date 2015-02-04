var Game = (function(){

	var instance;

	function init(){
		var unit_stage, map_stage, ui_stage, loader, hero;
		var cols = rows = 20;
		var scale = 1;

		window.onresize = function(){
			map_stage.canvas.width = unit_stage.canvas.width = window.innerWidth;
			map_stage.canvas.height = unit_stage.canvas.height = window.innerHeight;
			map_stage.update();
			unit_stage.update();
		};

		var hero_data = {
			src:"assets/Graphics/Characters/01 - Hero.png",
			src_id:"01 - Hero",
			portrait_src:"assets/Graphics/Faces/ds_face01-02.png",
			portrait_id:"ds_face01-02",
			index:0,
			level:1,
			exp:0,
			resource_type:"fury",
			resource:100,
			health:200,
			damage:5,
			attack_speed:60,
			armor:2,
			move_speed:5,
			critical_rate:0.1,
			critical_damage:2
		}

		var map_data = {
			maps:[{
				tiles:[
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				], 
				tile_map:[
					[32,0,32,32],
					[160,0,32,32],
				], 
				src:"assets/Graphics/Tilesets/A5/Exterior_Forest_TileA5.png", 
				id:"A5/Exterior_Forest_TileA5",
				block:false
				},{
				tiles:[
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				], 
				tile_map:[
					[0,160,32,32],
					[0,128,32,32],
					[32,128,32,32],
					[64,128,32,32],
					[0,192,32,32],
					[64,192,32,32],
					[64,160,32,32],
				], 
				src:"assets/Graphics/Tilesets/E/Exterior_Walls_TileE.png", 
				id:"E/Exterior_Walls_TileE",
				block:true
			}],
			width:cols*32,
			height:rows*32,
			cols:cols,
			rows:rows,
		};

		var manifest = [
			{src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"},
			{src:"assets/Graphics/Characters/23 - Soldier.png", id:"soldier"},
			{src:"assets/Graphics/Characters/29 - Monster.png", id:"monster29"},
		];

		manifest.push({src:hero_data.src,id:hero_data.src_id});
		manifest.push({src:hero_data.portrait_src,id:hero_data.portrait_id});
		map_data.maps.forEach(function(map){
			manifest.push({src:map.src,id:map.id});
		});
		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleLoadComplete);
		loader.loadManifest(manifest);

		function handleLoadComplete(){
			initMap();
			initUnit();

			createHero();
			for(var i=0;i<200;i++){
				createUnits();
				createEnemy();
			}
			initUI();
		}

		function initUnit(){
			unit_stage = new Unit_Stage(cols * 32 * scale, rows * 32 * scale, 20);
		}

		function initUI(){
			ui_stage = new UI_Stage(hero);
		}

		function initMap(){
			map_stage = new Map_Stage(map_data);
			blocks = map_stage.getBlock();
		}

		function createHero(){
			hero = new Hero(hero_data, 10*32+8, 10*32+8);
			unit_stage.addHero(hero);
		}

		function createUnits(){
			unit_stage.addFollower(new Follower("soldier", 0, Math.floor(Math.random()*cols)*32+8, Math.floor(Math.random()*rows)*32+8));
			//unit_stage.addFollower(new Follower("soldier", 0, 10*32+8, 10*32+8));
		}

		function createEnemy(){
			unit_stage.addUnit(new Monster("monster29", 0, Math.floor(Math.random()*cols)*32+8, Math.floor(Math.random()*rows)*32+8));
		}

		return {
			getLoader:function(){
				return loader;
			},
			findPath:function(destination){
				return PathFinder.flowField(blocks, destination);
			},
			getMapStage:function(){
				return map_stage;
			},
			getUnitStage:function(){
				return unit_stage;
			},
			getUIStage:function(){
				return ui_stage;
			},
			setScale:function(delta){
				scale += delta;
				scale = scale < 1 ? 1 :scale > 4 ? 4 : scale;
				map_stage.scaleX = map_stage.scaleY = scale;
				unit_stage.scaleX = unit_stage.scaleY = scale;
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