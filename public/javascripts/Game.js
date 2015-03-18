var Game = (function(){

	var instance;

	function init(user_builder, hero_builder, follower_builder_array, map_builder){
		var user, loader, hero, blocks;
		var minimap_stage, tooltip_stage, unit_stage, map_stage, ui_stage, left_stage, right_stage;
		var cols = map_builder.cols;
		var rows = map_builder.rows;
		var scale = 5;

		window.onresize = function(){
			map_stage.canvas.width = unit_stage.canvas.width = window.innerWidth;
			map_stage.canvas.height = unit_stage.canvas.height = window.innerHeight;
			map_stage.update();
			unit_stage.update();
			left_stage.update();
			right_stage.update();
		};

		/*
			skills:[
				{
					key:"q",
					name:"Shockwave",
					description:"Send a wave that deals 200% weapon damage to enemies up to 10 yards in a cone.",
					src:"assets/Graphics/icons/50x50/129.png",
					resource:"fury",
					radius:160,
					angle:60,
					type:"cone",
					damage:300,
					cost:15,
					cooldown:5,
					animation:{
						scale:0.5,
						width:163,
						height:167,
						regX:81,
						regY:167,
						images:[
							{src:"assets/Graphics/effects/shooter_fx/lava_shot_impact1.png",index:"lava_shot_impact1"},
							{src:"assets/Graphics/effects/shooter_fx/lava_shot_impact2.png",index:"lava_shot_impact2"},
							{src:"assets/Graphics/effects/shooter_fx/lava_shot_impact3.png",index:"lava_shot_impact3"},
							{src:"assets/Graphics/effects/shooter_fx/lava_shot_impact4.png",index:"lava_shot_impact4"},
						]
					}
				},{
					key:"w",
					name:"Bladestorm",
					description:"Deal 150% weapon damage to all enemies within 5 yards",
					src:"assets/Graphics/icons/50x50/115.png",
					resource:"fury",
					radius:80,
					angle:90,
					type:"impact",
					damage:200,
					cost:30,
					cooldown:10,
					animation:{
						scale:1,
						rotate:-45,
						width:160,
						height:160,
						regX:80,
						regY:80,
						images:[
							{src:"assets/Graphics/effects/impacts/orange_impx_0.png",index:"orange_impx_0"},
							{src:"assets/Graphics/effects/impacts/orange_impx_1.png",index:"orange_impx_1"},
							{src:"assets/Graphics/effects/impacts/orange_impx_2.png",index:"orange_impx_2"},
						]
					}
				},{
					key:"e",
					name:"Regeneration",
					description:"Heal you for 10% of your maximum health",
					src:"assets/Graphics/icons/50x50/108.png",
					resource:"fury",
					radius:80,
					angle:90,
					type:"heal",
					target:"self",
					heal:{
						type:"max_health",
						unit:"%",
						amount:10,
					},
					cost:25,
					cooldown:10,
					animation:{
						scale:0.5,
						rotate:0,
						width:160,
						height:160,
						regX:80,
						regY:80,
						images:[
							{src:"assets/Graphics/effects/shooter_fx/ring_shot_impact1.png",index:"ring_shot_impact1"},
							{src:"assets/Graphics/effects/shooter_fx/ring_shot_impact2.png",index:"ring_shot_impact2"},
							{src:"assets/Graphics/effects/shooter_fx/ring_shot_impact3.png",index:"ring_shot_impact3"},
						]
					}
				},{
					key:"r",
					name:"Berserk",
					description:"Increases all damage, attack speed, and movement speed 50% for 15 seconds",
					src:"assets/Graphics/icons/50x50/107.png",
					resource:"fury",
					angle:90,
					type:"buff",
					buff:{
						damage:0.5,
						attack_speed:0.5,
						movement_speed:0.5,
					},
					filter:[0.6,0,0,1],
					cost:50,
					cooldown:60,
					duration:15,
					animation:{
						images:[
							{src:"assets/Graphics/effects/impacts/orange_impx_0.png",index:"orange_impx_0"},
							{src:"assets/Graphics/effects/impacts/orange_impx_1.png",index:"orange_impx_1"},
							{src:"assets/Graphics/effects/impacts/orange_impx_2.png",index:"orange_impx_2"},
						]
					}
				}
			]
		};
		*/

		var manifest = [];

		manifest.push({src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"});

		manifest.push({src:hero_builder.sprite, id:hero_builder.sprite.split('/').pop()});
		manifest.push({src:hero_builder.portrait, id:hero_builder.portrait.split('/').pop()});

		follower_builder_array.forEach(function(unit_builder){
			manifest.push({src:unit_builder.sprite, id:unit_builder.sprite.split('/').pop()});
			if(unit_builder.portrait){
				manifest.push({src:unit_builder.portrait, id:unit_builder.portrait.split('/').pop()});
			}
		});

		map_builder.maps.forEach(function(map){
			manifest.push({src:map.src, id:map.src.split('/').pop()});
		});

		map_builder.npcs.forEach(function(npc){
			manifest.push({src:npc.attribute.sprite, id:npc.attribute.sprite.split('/').pop()});
		});

		map_builder.merchantable_items.forEach(function(item){
			manifest.push({src:item.icon.source, id:item.icon.source.split('/').pop()});
		});

		/*
		hero_builder.skills.forEach(function(skill){
			manifest.push({src:skill.src,id:skill.name});
			if(skill.animation.images){
				skill.animation.images.forEach(function(frame){
					manifest.push({src:frame.src,id:frame.index});
				});
			}
		});
		*/

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleLoadComplete);
		loader.loadManifest(manifest);

		function handleLoadComplete(){
			initStages();

			user = new User(user_builder);

			createHero(hero_builder);

			follower_builder_array.forEach(function(unit_builder){
				createFollower(unit_builder);
			});

			map_builder.npcs.forEach(function(unit_builder){
				unit_builder.attribute.x =  unit_builder.position.x;
				unit_builder.attribute.y =  unit_builder.position.y;
				createNPC(unit_builder.attribute);
			});

			ui_stage.initHeroUI(hero);
			minimap_stage.initUnits(unit_stage.getNPCUnits());
			minimap_stage.initUnits(unit_stage.getUnits());
		}

		function initStages(){
			map_stage = new Map_Stage(map_builder);
			blocks = map_stage.getBlock();
			minimap_stage = new Minimap_Stage();
			unit_stage = new Unit_Stage(cols * 32, rows * 32);
			tooltip_stage = new Tooltip_Stage();
			ui_stage = new UI_Stage();
			map_stage.scaleX = map_stage.scaleY = scale;
			unit_stage.scaleX = unit_stage.scaleY = scale;
			map_stage.update();

			left_stage = new MenuStage("left_menu", 310, window.innerHeight);
			right_stage = new MenuStage("right_menu", 310, window.innerHeight);
		}

		function createHero(builder){
			builder.x = map_stage.getStartPosition().x;
			builder.y = map_stage.getStartPosition().y;
			builder.blocks = blocks;
			hero = new Hero(builder);
			unit_stage.addHero(hero);
		}

		function createFollower(builder){
			builder.x = map_stage.getStartPosition().x + Math.random();
			builder.y = map_stage.getStartPosition().y + Math.random();
			builder.blocks = blocks;
			unit_stage.addFollower(new Follower(builder));
		}

		function createEnemy(builder){
			builder.blocks = blocks;
			unit_stage.addUnit(new Monster(builder));
		}

		function createNPC(builder){
			switch(builder.type){
				case "merchant":
					unit_stage.addUnit(new Merchant(builder));
				break;
				case "recruiter":
					unit_stage.addUnit(new Recruiter(builder));
				break;
				case "blacksmith":
					unit_stage.addUnit(new Blacksmith(builder));
				break;
				case "battlemaster":
					unit_stage.addUnit(new Battlemaster(builder));
				break;
				default:
					//unit_stage.addUnit(new NPC(builder));
				break;
			}
			
		}

		return {
			getUser:function(){
				return user;
			},
			getLoader:function(){
				return loader;
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
			getTooltipStage:function(){
				return tooltip_stage;
			},
			getMinimapStage:function(){
				return minimap_stage;
			},
			getLeftMenuStage:function(){
				return left_stage;
			},
			getRighttMenuStage:function(){
				return right_stage;
			},
			getMerchantableItems:function(){
				return map_builder.merchantable_items;
			},
			getRecruitableUnits:function(){
				return map_builder.recruitable_units;
			},
			setScale:function(delta){
				scale += delta;
				scale = scale < 1 ? 1 :scale > 5 ? 5 : scale;
				map_stage.scaleX = map_stage.scaleY = scale;
				unit_stage.scaleX = unit_stage.scaleY = scale;
				map_stage.update();
			},
			viewport:function(){
				var regX = hero.x - window.innerWidth / scale / 2;
				var regY = hero.y - window.innerHeight / scale / 2;

				var maxX = (cols * 32) - window.innerWidth / scale;
				var maxY = (rows * 32) - window.innerHeight / scale;

				regX = regX < 0 ? 0 : regX > maxX ? maxX : regX;
				regY = regY < 0 ? 0 : regY > maxY ? maxY : regY;

				map_stage.regX = unit_stage.regX = map_stage.width < window.innerWidth / scale ? 0 : regX;
				map_stage.regY = unit_stage.regY = map_stage.height < window.innerHeight / scale ? 0 : regY;
				map_stage.update();
			}
		}
	}

	return {
		getInstance:function(user_builder, hero_builder, follower_builder_array, map_builder){
			if(!instance){
				instance = init(user_builder, hero_builder, follower_builder_array, map_builder);
			}
			return instance;
		}
	}
})();