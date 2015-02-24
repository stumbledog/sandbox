var Game = (function(){

	var instance;

	function init(user_builder, unit_builder_array, map_builder){
		var unit_stage, map_stage, ui_stage, loader, minimap_stage, tooltip_stage, hero, blocks;
		var cols = map_builder.cols;
		var rows = map_builder.rows;
		var scale = 5;

		window.onresize = function(){
			map_stage.canvas.width = unit_stage.canvas.width = window.innerWidth;
			map_stage.canvas.height = unit_stage.canvas.height = window.innerHeight;
			map_stage.update();
			unit_stage.update();
		};

		/*
		var hero_builder = {
			src:"assets/Graphics/Characters/01 - Hero.png",
			src_id:"01 - Hero",
			portrait_src:"assets/Graphics/Faces/ds_face01-02.png",
			portrait_id:"ds_face01-02",
			index:0,
			level:1,
			exp:0,
			resource_type:"fury",
			resource:0,
			max_resource:100,
			health:100,
			damage:1,
			attack_speed:30,
			armor:2,
			movement_speed:1.5,
			critical_rate:0.1,
			critical_damage:2,
			radius:12,
			aggro_radius:80,
			range:16,
			type:"hero",
			team:"player",
			health_color:"#0C0",
			damage_color:"#C00",
			weapon:{
				type:"melee",
				src:"assets/Graphics/System/Icons/IconSet.png",
				src_id:"IconSet",
				cropX:292,
				cropY:100,
				width:16,
				height:16,
				regX:12,
				regY:12,
				scale:0.8,
			},
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

		var follow_builder = {
			src:"assets/Graphics/Characters/23 - Soldier.png",
			src_id:"23 - Soldier",
			index:0,
			level:1,
			exp:0,
			resource_type:"fury",
			resource:0,
			max_resource:100,
			health:50,
			damage:2,
			attack_speed:60,
			armor:2,
			movement_speed:1.5,
			critical_rate:0.1,
			critical_damage:2,
			radius:12,
			aggro_radius:80,
			range:16,
			type:"follow",
			team:"player",
			health_color:"#046380",
			damage_color:"#C00",
			weapon:{
				type:"melee",
				src:"assets/Graphics/System/Icons/IconSet.png",
				src_id:"IconSet",
				cropX:292,
				cropY:100,
				width:16,
				height:16,
				regX:12,
				regY:12,
				scale:0.8,
			}
		};

		var monster_builder = {
			src:"assets/Graphics/Characters/29 - Monster.png",
			src_id:"29 - Monster",
			index:0,
			level:1,
			exp:200,
			resource_type:"mana",
			resource:20,
			max_resource:20,
			health:10,
			damage:1,
			attack_speed:60,
			armor:0,
			movement_speed:1,
			critical_rate:0.0,
			critical_damage:1,
			radius:4,
			aggro_radius:80,
			range:16,
			type:"monster",
			team:"enemy",
			health_color:"#C00",
			damage_color:"#CC0",
		};
		*/
		var map_data = {
			maps:[{
				tiles:[
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
				], 
				tile_map:[
					[32,0,32,32],
					[160,0,32,32],
				], 
				src:"assets/Graphics/Tilesets/A5/Exterior_Forest_TileA5.png", 
				index:"A5/Exterior_Forest_TileA5",
				block:false
				},{
				tiles:[
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0],
					[0,2,3,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
					[0,1,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,1,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
				index:"E/Exterior_Walls_TileE",
				block:true
			}],
			width:cols*32,
			height:rows*32,
			cols:cols,
			rows:rows,
			start_point:[32,32],
		};

		var manifest = [];
		unit_builder_array.forEach(function(unit_builder){
			var id = unit_builder.src.split('/').pop();
			manifest.push({src:unit_builder.src, id:id});
			if(unit_builder.portrait_src){
				var id = unit_builder.portrait_src.split('/').pop();
				manifest.push({src:unit_builder.portrait_src, id:id});
			}
		});
		/*
		manifest.push({src:unit_builder_array[0].src,id:unit_builder_array[0].src_id});
		manifest.push({src:unit_builder_array[0].portrait_src,id:unit_builder_array[0].portrait_id});
		manifest.push({src:hero_builder.weapon.src,id:hero_builder.weapon.src_id});
		manifest.push({src:follow_builder.src,id:follow_builder.src_id});
		manifest.push({src:monster_builder.src,id:monster_builder.src_id});
		*/

		map_builder.maps.forEach(function(map){
			var id = map.src.split('/').pop();
			manifest.push({src:map.src, id:id});
		});

		map_builder.units.forEach(function(unit){
			var id = unit.prototype_unit.src.split('/').pop();
			manifest.push({src:unit.prototype_unit.src, id:id});
		})
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
			initMapStage();
			initMinimapStage();
			initUnitStage();
			initTooltipStage();
			initUIStage();

			unit_builder_array.forEach(function(unit_builder){
				switch(unit_builder.type){
					case "hero":
					createHero(unit_builder);
					break;
					case "follow":
					createFollower(unit_builder);
					break;
				}
			});

			map_builder.units.forEach(function(unit_builder){
				unit_builder.prototype_unit.x =  unit_builder.position.x;
				unit_builder.prototype_unit.y =  unit_builder.position.y;
				switch(unit_builder.prototype_unit.team){
					case "enemy":
						createEnemy(unit_builder.prototype_unit);
						break;
					case "player":
						createNPC(unit_builder.prototype_unit);
						break;
				}
			});

			ui_stage.initHeroUI(hero);
			minimap_stage.initUnits(unit_stage.getUnits());
		}

		function initMapStage(){
			map_stage = new Map_Stage(map_builder);
			blocks = map_stage.getBlock();
		}

		function initUnitStage(){
			unit_stage = new Unit_Stage(cols * 32, rows * 32, 20);
		}

		function initUIStage(){
			ui_stage = new UI_Stage();
			map_stage.scaleX = map_stage.scaleY = scale;
			unit_stage.scaleX = unit_stage.scaleY = scale;
			map_stage.update();
		}

		function initMinimapStage(){
			minimap_stage = new Minimap_Stage();
		}

		function initTooltipStage(){
			tooltip_stage = new Tooltip_Stage();
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
			builder.blocks = blocks;
			unit_stage.addUnit(new NPC(builder));	
		}

		return {
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
			setScale:function(delta){
				scale += delta;
				scale = scale < 2 ? 2 :scale > 5 ? 5 : scale;
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

				map_stage.regX = unit_stage.regX = regX;
				map_stage.regY = unit_stage.regY = regY;
				map_stage.update();
			}
		}
	}

	return {
		getInstance:function(user_builder, unit_builder_array, map_builder){
			if(!instance){
				instance = init(user_builder, unit_builder_array, map_builder);
			}
			return instance;
		}
	}
})();