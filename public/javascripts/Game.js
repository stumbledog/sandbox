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

		manifest.push({src:"assets/Graphics/Characters/01 - Hero.png",		id:"hero"});
		manifest.push({src:"assets/Graphics/Characters/02 - Warrior.png",	id:"warrior"});
		manifest.push({src:"assets/Graphics/Characters/03 - Cleric.png",	id:"cleric"});
		manifest.push({src:"assets/Graphics/Characters/04 - Mage.png",		id:"mage"});
		manifest.push({src:"assets/Graphics/Characters/05 - Fighter.png",	id:"fighter"});
		manifest.push({src:"assets/Graphics/Characters/06 - Thief.png",		id:"thief"});
		manifest.push({src:"assets/Graphics/Characters/07 - Child.png",		id:"child"});
		manifest.push({src:"assets/Graphics/Characters/08 - Young.png",		id:"young"});
		manifest.push({src:"assets/Graphics/Characters/09 - Adult.png",		id:"adult"});
		manifest.push({src:"assets/Graphics/Characters/10 - Old.png",		id:"old"});
		manifest.push({src:"assets/Graphics/Characters/11 - Employee.png",	id:"employee"});
		manifest.push({src:"assets/Graphics/Characters/12 - Merchant.png",	id:"merchant"});
		manifest.push({src:"assets/Graphics/Characters/13 - Church.png",	id:"church"});
		manifest.push({src:"assets/Graphics/Characters/14 - Seer.png",		id:"seer"});
		manifest.push({src:"assets/Graphics/Characters/15 - Pirate.png",	id:"pirate"});
		manifest.push({src:"assets/Graphics/Characters/16 - BunnyGirl.png",	id:"bunny_girl"});
		manifest.push({src:"assets/Graphics/Characters/17 - Elve.png",		id:"elve"});
		manifest.push({src:"assets/Graphics/Characters/18 - Neko Girl.png",	id:"neko_girl"});
		manifest.push({src:"assets/Graphics/Characters/19 - Cook.png",		id:"cook"});
		manifest.push({src:"assets/Graphics/Characters/20 - Fairy.png",		id:"fairy"});
		manifest.push({src:"assets/Graphics/Characters/21 - Royal.png",		id:"royal"});
		manifest.push({src:"assets/Graphics/Characters/22 - Royal.png",		id:"royal2"});
		manifest.push({src:"assets/Graphics/Characters/23 - Soldier.png",	id:"soldier"});
		manifest.push({src:"assets/Graphics/Characters/26 - Animal.png",	id:"animal"});
		manifest.push({src:"assets/Graphics/Characters/27 - Animal.png",	id:"animal2"});
		manifest.push({src:"assets/Graphics/Characters/28 - Flame.png",		id:"flame"});
		manifest.push({src:"assets/Graphics/Characters/29 - Monster.png",	id:"monster"});
		manifest.push({src:"assets/Graphics/Characters/30 - Monster.png",	id:"monster2"});
		manifest.push({src:"assets/Graphics/Characters/31 - Monster.png",	id:"monster3"});
		manifest.push({src:"assets/Graphics/Characters/32 - Dragon.png",	id:"dragon"});
		manifest.push({src:"assets/Graphics/Characters/33 - Boss.png",		id:"boss"});
		manifest.push({src:"assets/Graphics/Characters/34 - Boss.png",		id:"boss2"});
		
		manifest.push({src:"assets/Graphics/Faces/ds_face01-02.png", id:"portrait1"});
		manifest.push({src:"assets/Graphics/Faces/ds_face03-04.png", id:"portrait2"});
		manifest.push({src:"assets/Graphics/Faces/ds_face05-06.png", id:"portrait3"});
		manifest.push({src:"assets/Graphics/Faces/ds_face07-08.png", id:"portrait4"});
		manifest.push({src:"assets/Graphics/Faces/ds_face09-10.png", id:"portrait5"});
		manifest.push({src:"assets/Graphics/Faces/ds_face11-12.png", id:"portrait6"});
		manifest.push({src:"assets/Graphics/Faces/ds_face13-14.png", id:"portrait7"});
		manifest.push({src:"assets/Graphics/Faces/ds_face15-16.png", id:"portrait8"});
		manifest.push({src:"assets/Graphics/Faces/ds_face17-18.png", id:"portrait9"});
		manifest.push({src:"assets/Graphics/Faces/ds_face19-20.png", id:"portrait10"});
		manifest.push({src:"assets/Graphics/Faces/ds_face21-22.png", id:"portrait11"});
		manifest.push({src:"assets/Graphics/Faces/ds_face23-24.png", id:"portrait12"});
		manifest.push({src:"assets/Graphics/Faces/ds_face25-26.png", id:"portrait13"});
		manifest.push({src:"assets/Graphics/Faces/ds_face27-28.png", id:"portrait14"});
		manifest.push({src:"assets/Graphics/Faces/ds_face29-30.png", id:"portrait15"});
		manifest.push({src:"assets/Graphics/Faces/ds_face31-32.png", id:"portrait16"});
		manifest.push({src:"assets/Graphics/Faces/ds_face33-34.png", id:"portrait17"});
		manifest.push({src:"assets/Graphics/Faces/ds_face35-36.png", id:"portrait18"});
		manifest.push({src:"assets/Graphics/Faces/ds_face37-38.png", id:"portrait19"});
		manifest.push({src:"assets/Graphics/Faces/ds_face39-40.png", id:"portrait20"});

		user_builder.followers.forEach(function(follower){
			if(follower.model.active_skills){
				follower.model.active_skills.forEach(function(skill){
					if(skill.icon_source){
						manifest.push({src:skill.icon_source,id:skill.icon_source.split('/').pop()});
					}
					if(skill.name === "Leap Attack"){
						skill.animation.land.images.forEach(function(image){
							manifest.push({src:image,id:image.split('/').pop()});
						});
						skill.animation.jump.images.forEach(function(image){
							manifest.push({src:image,id:image.split('/').pop()});
						});
					}else if(skill.animation){
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
		/*
		map_builder.npcs.forEach(function(npc){
			manifest.push({src:npc.sprite, id:npc.sprite.split('/').pop()});
		});
		*/
		/*
		if(map_builder.merchantable_items){
			map_builder.merchantable_items.forEach(function(item){
				manifest.push({src:item.icon.source, id:item.icon.source.split('/').pop()});
			});
		}
		*/

		if(map_builder.recruitable_units){
			map_builder.recruitable_units.forEach(function(recruitable_unit){
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
		}
		/*
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
		}*/

		if(map_builder.monsters){
			map_builder.monsters.forEach(function(monster){
				manifest.push({src:monster.sprite, id:monster.sprite.split('/').pop()});
			});
		}

		if(user_builder.hero.model.active_skills){
			user_builder.hero.model.active_skills.forEach(function(skill){
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
					unit_stage.addUnit(new Recruiter(builder, map_builder.recruitable_units));
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