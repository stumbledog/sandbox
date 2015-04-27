var Game = (function(){

	var instance;

	function init(user_builder, map_builder, difficulty_level){
		var user, loader, hero, blocks;
		var minimap_stage, tooltip_stage, unit_stage, map_stage, ui_stage, left_stage, right_stage, top_stage, effect, message_stage;
		var scale = 5;

		window.onresize = function(){
			message_stage.canvas.width = map_stage.canvas.width = unit_stage.canvas.width = window.innerWidth;
			message_stage.canvas.height = map_stage.canvas.height = unit_stage.canvas.height = window.innerHeight;
			map_stage.update();
			unit_stage.update();
			left_stage.update();
			right_stage.update();
			top_stage.update();
		};

		var manifest = [];
		manifest.push({src:"assets/Graphics/System/Icons/IconSet.png", id:"icon"});

		manifest.push({src:user_builder.hero.sprite, id:user_builder.hero.sprite.split('/').pop()});
		manifest.push({src:user_builder.hero.portrait, id:user_builder.hero.portrait.split('/').pop()});
		/*
		if(user_builder.inventory.slots){
			user_builder.inventory.slots.forEach(function(item){
				manifest.push({src:item.icon.source, id:item.icon.source.split('/').pop()});
			});
		}*/

		/*
		if(user_builder.hero.items){
			for(key in user_builder.hero.items){
				if(user_builder.hero.items[key]){
					if(user_builder.hero.items[key].icon){
						manifest.push({src:user_builder.hero.items[key].icon.source, id:user_builder.hero.items[key].icon.source.split('/').pop()});
					}
				}
			}
		}
		*/

		user_builder.followers.forEach(function(unit_builder){
			/*
			if(unit_builder.items){
				for(key in unit_builder.items){
					if(unit_builder.items[key]){
						if(unit_builder.items[key].icon){
							manifest.push({src:unit_builder.items[key].icon.source, id:unit_builder.items[key].icon.source.split('/').pop()});
						}
					}
				}
			}*/
			manifest.push({src:unit_builder.sprite, id:unit_builder.sprite.split('/').pop()});
			if(unit_builder.portrait){
				manifest.push({src:unit_builder.portrait, id:unit_builder.portrait.split('/').pop()});
			}
			if(unit_builder.active_skills){
				unit_builder.active_skills.forEach(function(skill){
					if(skill.icon_source){
						manifest.push({src:skill.icon_source,id:skill.icon_source.split('/').pop()});
					}
					if(skill.animation){
						skill.animation.images.forEach(function(image){
							manifest.push({src:image,id:image.split('/').pop()});
						});
					}
				});
			}
		});

		manifest.push({src:"assets/Graphics/effects/magic_0/round_shot.png",id:"round_shot"});

		map_builder.maps.forEach(function(map){
			manifest.push({src:map.src, id:map.src.split('/').pop()});
		});

		map_builder.npcs.forEach(function(npc){
			manifest.push({src:npc.sprite, id:npc.sprite.split('/').pop()});
		});

		/*
		if(map_builder.merchantable_items){
			map_builder.merchantable_items.forEach(function(item){
				manifest.push({src:item.icon.source, id:item.icon.source.split('/').pop()});
			});
		}
		*/

		if(map_builder.npcs){
			map_builder.npcs.forEach(function(npc){
				npc.recruitable_units.forEach(function(recruitable_unit){
					manifest.push({src:recruitable_unit.sprite, id:recruitable_unit.sprite.split('/').pop()});
					manifest.push({src:recruitable_unit.portrait, id:recruitable_unit.portrait.split('/').pop()});
					if(recruitable_unit.active_skills){
						recruitable_unit.active_skills.forEach(function(skill){
							if(skill.icon_source){
								manifest.push({src:skill.icon_source,id:skill.icon_source.split('/').pop()});
							}
							if(skill.animation){
								skill.animation.images.forEach(function(image){
									manifest.push({src:image,id:image.split('/').pop()});
								});
							}
						});
					}
				});
			});
		}

		if(map_builder.monsters){
			map_builder.monsters.forEach(function(monster){
				manifest.push({src:monster.sprite, id:monster.sprite.split('/').pop()});
			});
		}

		if(user_builder.hero.active_skills){
			user_builder.hero.active_skills.forEach(function(skill){
				if(skill.icon_source){
					manifest.push({src:skill.icon_source,id:skill.icon_source.split('/').pop()});
				}
				if(skill.animation){
					skill.animation.images.forEach(function(image){
						manifest.push({src:image,id:image.split('/').pop()});
					});
				}
			});
		}

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

			message_stage.displayMessage("left_to_right", map_builder.name, 60, "#FFF0A5", 10, "#000", 1000, 0, -60);

			var queue = new createjs.LoadQueue();
			createjs.Sound.alternateExtensions = ["ogg"];
			queue.installPlugin(createjs.Sound);
			queue.addEventListener("complete", function(){
				//var bgm = createjs.Sound.play("bgm");
				//bgm.setLoop(true);
			});


			if(map_builder.act === 0 && map_builder.chapter === 0){
				queue.loadFile({id:"bgm", src:"assets/Audio/BGM/10 Pleasant travel.ogg"});
			}else if(map_builder.act === 1 && map_builder.chapter === 1){
				queue.loadFile({id:"bgm", src:"assets/Audio/BGM/01 First battle.ogg"});
			}

			if(map_builder.act !== 0){
				var index = difficulty_level;
				message_stage.displayMessage("left_to_right", Math.round(100 * Math.pow(2,index))+"% Health\n"+Math.round(100 * Math.pow(1.6,index))+"% Damage\n" + 100 * index + "% Extra Gold Bonus\n" + 100 * index + "% Extra XP Bonus\n" + 100 * index + "% Item Drop Bonus", 20, "#fff", 5, "#000", 1000, 0, 0);
			}
		}

		function initStages(){
			message_stage = new MessageStage();
			map_stage = new Map_Stage(map_builder);
			minimap_stage = new Minimap_Stage();
			unit_stage = new Unit_Stage(map_builder.width,map_builder.height);
			effect = unit_stage.effect;
			tooltip_stage = new Tooltip_Stage();
			ui_stage = new UI_Stage();
			map_stage.scaleX = map_stage.scaleY = scale;
			unit_stage.scaleX = unit_stage.scaleY = scale;
			map_stage.update();

			left_stage = new MenuStage("left_menu", 310, window.innerHeight);
			right_stage = new MenuStage("right_menu", 310, window.innerHeight);
			top_stage = new MenuStage("menu", 200, 60);
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
			builder.x += Math.random();
			builder.y += Math.random();
			builder.difficulty_level = difficulty_level;
			builder.hero_level = user_builder.hero.level;
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
			}
			
		}

		return {
			getDifficultyLevel:function(){
				return difficulty_level;
			},
			getAct:function(){
				return map_builder.act;
			},
			getChapter:function(){
				return map_builder.chapter;
			},
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
			getTopMenuStage:function(){
				return top_stage;
			},
			getMessageStage:function(){
				return message_stage;
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
		getInstance:function(user_builder, map_builder, difficulty_level){
			if(!instance){
				instance = init(user_builder, map_builder, difficulty_level);
			}
			return instance;
		}
	}
})();