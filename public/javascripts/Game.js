var Game = (function(){

	var instance;

	function init(user_builder, map_builder){
		var user, loader, hero, blocks;
		var minimap_stage, tooltip_stage, unit_stage, map_stage, ui_stage, left_stage, right_stage;
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

		manifest.push({src:user_builder.hero.sprite, id:user_builder.hero.sprite.split('/').pop()});
		manifest.push({src:user_builder.hero.portrait, id:user_builder.hero.portrait.split('/').pop()});

		user_builder.followers.forEach(function(unit_builder){
			manifest.push({src:unit_builder.sprite, id:unit_builder.sprite.split('/').pop()});
			if(unit_builder.portrait){
				manifest.push({src:unit_builder.portrait, id:unit_builder.portrait.split('/').pop()});
			}
		});

		map_builder.maps.forEach(function(map){
			manifest.push({src:map.src, id:map.src.split('/').pop()});
		});

		map_builder.npcs.forEach(function(npc){
			manifest.push({src:npc.sprite, id:npc.sprite.split('/').pop()});
		});

		if(map_builder.merchantable_items){
			map_builder.merchantable_items.forEach(function(item){
				manifest.push({src:item.icon.source, id:item.icon.source.split('/').pop()});
			});
		}

		if(map_builder.npcs){
			map_builder.npcs.forEach(function(npc){
				npc.recruitable_units.forEach(function(recruitable_unit){
					manifest.push({src:recruitable_unit.sprite, id:recruitable_unit.sprite.split('/').pop()});
					manifest.push({src:recruitable_unit.portrait, id:recruitable_unit.portrait.split('/').pop()});
				});
			});
		}

		if(map_builder.monsters){
			map_builder.monsters.forEach(function(monster){
				manifest.push({src:monster.sprite, id:monster.sprite.split('/').pop()});
			});
		}
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
			user = new User(user_builder);
			initStages();
			createHero(user_builder.hero);

			user_builder.followers.forEach(function(unit_builder){
				createFollower(unit_builder);
			});

			map_builder.npcs.forEach(function(unit_builder){
				createNPC(unit_builder);
			});

			map_builder.monsters.forEach(function(unit_builder){
				createEnemy(unit_builder);
			});


			ui_stage.initHeroUI(hero);
			minimap_stage.initUnits(unit_stage.getNPCUnits());
			minimap_stage.initUnits(unit_stage.getUnits());
		}

		function initStages(){
			map_stage = new Map_Stage(map_builder);
			minimap_stage = new Minimap_Stage();
			unit_stage = new Unit_Stage(map_builder.width,map_builder.height);
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
			hero = new Hero(builder);
			user.setHero(hero);
			unit_stage.addHero(hero);
		}

		function createFollower(builder){
			builder.x = map_stage.getStartPosition().x + Math.random();
			builder.y = map_stage.getStartPosition().y + Math.random();
			var follower = new Follower(builder);
			user.addFollower(follower);
			if(!map_builder.neutral_territory){
				unit_stage.addFollower(follower);
			}
		}

		function createEnemy(builder){
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
					builder.world_map = map_builder.world_map;
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
			getBlock:function(){
				return map_stage.getBlock();
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
			getStartPosition:function(){
				return map_stage.getStartPosition();
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

				var maxX = (map_builder.width) - window.innerWidth / scale;
				var maxY = (map_builder.height) - window.innerHeight / scale;

				regX = regX < 0 ? 0 : regX > maxX ? maxX : regX;
				regY = regY < 0 ? 0 : regY > maxY ? maxY : regY;

				map_stage.regX = unit_stage.regX = map_stage.width < window.innerWidth / scale ? 0 : regX;
				map_stage.regY = unit_stage.regY = map_stage.height < window.innerHeight / scale ? 0 : regY;
				map_stage.update();
			}
		}
	}

	return {
		getInstance:function(user_builder, map_builder){
			if(!instance){
				instance = init(user_builder, map_builder);
			}
			return instance;
		}
	}
})();