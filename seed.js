mongoose = require('mongoose');
Schema = mongoose.Schema;
fs = require('fs');
require('./models/PrototypeUnitModel');
require('./models/PrototypeWeaponModel');
require('./models/PrototypeArmorModel');
require('./models/PrototypeConsumableItemModel');
require('./models/PrototypeHeroModel');
require('./models/PrototypeFollowerModel');
require('./models/MapModel');
require('./models/NPCModel');
require('./models/UserModel');

mongoose.connect('mongodb://localhost/condottiere');

var connection = mongoose.connection;
connection.on("error", console.error.bind(console, 'connection error:'));
connection.once("open", function(){
	PrototypeUnitModel.remove().exec().then(function(count){
		console.log(count + " prototype units are deleted");
		return MapModel.remove().exec();
	}).then(function(count){
		console.log(count + " maps are deleted");
		return UserModel.remove().exec();
	}).then(function(count){
		console.log(count + " users are deleted");
		return PrototypeWeaponModel.remove().exec();
	}).then(function(count){
		console.log(count + " weapons are deleted");
		return PrototypeArmorModel.remove().exec();
	}).then(function(count){
		console.log(count + " armors are deleted");
		return PrototypeConsumableItemModel.remove().exec();
	}).then(function(count){
		console.log(count + " consumable items are deleted");
		return PrototypeHeroModel.remove().exec();
	}).then(function(count){
		console.log(count + " Heroes are deleted");
		return NPCModel.remove().exec();
	}).then(function(count){
		console.log(count + " NPCs are deleted");
		savePrototypeUnit();
	});
});

function savePrototypeUnit(){
	var units = [];
/*
	units.push(initPrototypeUnit(  0, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 0, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  1, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 1, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  2, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 2, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  3, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 3, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  4, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 4, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  5, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 5, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  6, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 6, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));
	units.push(initPrototypeUnit(  7, 'Hero', 10, 3, 2, 10, "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 7, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0, false));

	name:String,
	primary_attribute:String,
	sprite:String,
	portrait:String,
	index:Number,
	resource_type:String,
	_skills:[{type:Schema.Types.ObjectId, ref:'Skill'}]
*/
	units.push(new PrototypeHeroModel({name:"Albert", primary_attribute:"strength", sprite:"assets/Graphics/Characters/01 - Hero.png", portrait:"assets/Graphics/Faces/ds_face01-02.png", index:0, resource_type:"fury"}));

	units.push(new PrototypeFollowerModel({name:"Albert", primary_attribute:"strength", sprite:"assets/Graphics/Characters/01 - Hero.png", portrait:"assets/Graphics/Faces/ds_face01-02.png", index:1, resource_type:"fury"}));
	units.push(new PrototypeFollowerModel({name:"Albert", primary_attribute:"strength", sprite:"assets/Graphics/Characters/01 - Hero.png", portrait:"assets/Graphics/Faces/ds_face01-02.png", index:2, resource_type:"fury"}));

	units.push(new NPCModel({_id:100, name:"Merchant",		sprite:"assets/Graphics/Characters/12 - Merchant.png",	index:0, type:"merchant"}));
	units.push(new NPCModel({_id:101, name:"Recruiter",		sprite:"assets/Graphics/Characters/12 - Merchant.png",	index:1, type:"recruiter"}));
	units.push(new NPCModel({_id:102, name:"Blacksmith",	sprite:"assets/Graphics/Characters/12 - Merchant.png",	index:2, type:"blacksmith"}));
	units.push(new NPCModel({_id:103, name:"Battlemaster",	sprite:"assets/Graphics/Characters/23 - Soldier.png",	index:0, type:"battlemaster"}));

	/*
	units.push(initPrototypeUnit(101, 'Recruiter', 10, 3, 2, 10, "assets/Graphics/Characters/12 - Merchant.png", null, 1, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0, false));
	units.push(initPrototypeUnit(102, 'Blacksmith', 10, 3, 2, 10, "assets/Graphics/Characters/12 - Merchant.png", null, 2, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0, false));
	units.push(initPrototypeUnit(103, 'Battlemaster', 10, 3, 2, 10, "assets/Graphics/Characters/23 - Soldier.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0, false));
	units.push(initPrototypeUnit(200, 'slime', 10, 3, 2, 10, "assets/Graphics/Characters/29 - Monster.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 1, 0, 1, 4, 80, 16, "monster", "enemy", "#C00", "#CC0", 0, 8, true));

	units.push(initPrototypeUnit(300, 'slime', 10, 3, 2, 10, "assets/Graphics/Characters/29 - Monster.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 1, 0, 1, 4, 80, 16, "monster", "enemy", "#C00", "#CC0", 0, 8, false));
	*/
	var count = 0;
	units.forEach(function(unit){
		unit.save(function(){
			count++;
			if(count === units.length){
				console.log(count + " prototype units are created");
				saveMap();
			}
		});
	});
}

function saveMap(){
	var maps = [];
	maps.push(initMap(
		[
			{
				tiles:[
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1],
				],
				tile_map:[
					[32,0],
				], 
				src:"assets/Graphics/Tilesets/A5/Overworld_TileA5.png",
				block:false
			},
			{
				tiles:[
					[ 0, 0, 1, 2, 3, 3, 4, 5, 0, 0],
					[ 0, 0, 6, 7, 8, 8, 9,10, 0, 0],
					[ 0, 0,11,12,21,13,14,15, 0, 0],
					[ 0, 0,16,17,22,18,19,20, 0, 0],
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[23,24,25, 0, 0, 0, 0, 0, 0, 0],
					[26,27,28, 0, 0, 0, 0, 0, 0, 0],
					[29,30,31, 0, 0, 0, 0, 0, 0, 0],
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
					[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				],
				tile_map:[
					[32*8,	32*3],	[32*9,	32*3],	[32*10,	32*3],
					[32*11,	32*3],	[32*12,	32*3],	[32*8,	32*4],
					[32*9,	32*4],	[32*10,	32*4],	[32*11,	32*4],
					[32*12,	32*4],	[32*8,	32*5],	[32*9,	32*5],
					[32*10,	32*5],	[32*11,	32*5],	[32*12,	32*5],
					[32*8,	32*6],	[32*9,	32*6], 
					[32*10,	32*6],	[32*11,	32*6],	[32*12,	32*6],
					[32*14,	32*3],	[32*14,	32*4],
					[32*5,	32*13],	[32*6,	32*13],	[32*7,	32*13],
					[32*5,	32*14],	[32*6,	32*14],	[32*7,	32*14],
					[32*5,	32*15],	[32*6,	32*15],	[32*7,	32*15],
				], 
				src:"assets/Graphics/Tilesets/B/Exterior_Forest_TileB.png",
				block:true
			}
		],
		[
			{attribute:100, position:{x:32*4, y:32*4}},
			{attribute:101, position:{x:32*6, y:32*4}},
			{attribute:102, position:{x:32*3, y:32*7}},
			{attribute:103, position:{x:32*7, y:32*7}}

		],
		[],1,1,true,true,320,320,10,10,[160,160]
	));
	var count = 0;
	maps.forEach(function(map){
		map.save(function(){
			count++;
			if(count === maps.length){
				console.log(count + " maps are created");
				saveItems();
			}
		});
	});
}

function saveItems(){
	var items = [];

	items.push(new PrototypeWeaponModel({primary_attribute:1, hand:1, type:"weapon", attack_type:"melee", name:"Dagger",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:245,cropY:102,width:13,height:14,regX:9,regY:9,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:245,cropY:102,width:13,height:14,regX:9,regY:9,scale:0.8},
		min_damage:1.5,max_damage:3,range:16,attack_speed:60,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:1, type:"weapon", attack_type:"melee", name:"Long\nSword",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:267,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:267,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		min_damage:2,max_damage:4,range:16,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:2, type:"weapon", attack_type:"melee", name:"Great\nSword",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:292,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:292,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		min_damage:3,max_damage:6,range:32,attack_speed:90,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:1, type:"weapon", attack_type:"melee", name:"Masamune",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:364,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:364,cropY:100,width:16,height:16,regX:12,regY:12,scale:0.8},
		min_damage:2,max_damage:4,range:16,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:2, type:"weapon", attack_type:"melee", name:"Spear",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:6,cropY:124,width:16,height:16,regX:12,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:6,cropY:124,width:16,height:16,regX:12,regY:12,scale:0.8},
		min_damage:3,max_damage:6,range:32,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:1, type:"weapon", attack_type:"melee", name:"Battle Axe",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:29,cropY:125,width:16,height:14,regX:12,regY:9,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:29,cropY:125,width:16,height:14,regX:12,regY:9,scale:0.8},
		min_damage:3,max_damage:6,range:16,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:0, hand:1, type:"weapon", attack_type:"melee", name:"Hammer",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:51,cropY:124,width:16,height:16,regX:10,regY:10,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:51,cropY:124,width:16,height:16,regX:10,regY:10,scale:0.8},
		min_damage:3,max_damage:6,range:16,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:1, hand:1, type:"weapon", attack_type:"melee", name:"Claw",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:77,cropY:124,width:15,height:15,regX:10,regY:10,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:77,cropY:124,width:15,height:15,regX:10,regY:10,scale:0.8},
		min_damage:1.5,max_damage:3,range:16,attack_speed:50,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:2, hand:1, type:"weapon", attack_type:"range", name:"Wand",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:196,cropY:125,width:16,height:16,regX:4,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:196,cropY:125,width:16,height:16,regX:4,regY:12,scale:0.8},
		min_damage:2,max_damage:4,range:160,attack_speed:75,
	}));

	items.push(new PrototypeWeaponModel({primary_attribute:2, hand:2, type:"weapon", attack_type:"range", name:"Staff",
		sprite:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:244,cropY:125,width:16,height:16,regX:4,regY:12,scale:0.8},
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:244,cropY:125,width:16,height:16,regX:4,regY:12,scale:0.8},
		min_damage:3,max_damage:6,range:160,attack_speed:75,
	}));

	items.push(new PrototypeArmorModel({primary_attribute:1, part:0, type:"armor", name:"Leather\nHelm",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:220,cropY:150,width:16,height:13,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:0, type:"armor", name:"Iron Helm",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:244,cropY:149,width:16,height:15,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:0, type:"armor", name:"Plate Helm",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:269,cropY:148,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:2, part:0, type:"armor", name:"Hood",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:292,cropY:149,width:16,height:15,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:1, part:1, type:"armor", name:"Tunic",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:292,cropY:125,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:1, part:1, type:"armor", name:"Chestguard",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:316,cropY:124,width:16,height:15,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:1, type:"armor", name:"Breastplate",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:341,cropY:125,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:1, type:"armor", name:"Chestplate",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:365,cropY:126,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:2, part:1, type:"armor", name:"Robe",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:77,cropY:150,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:2, part:1, type:"armor", name:"Raiment",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:123,cropY:149,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:2, type:"armor", name:"Groves",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:125,cropY:126,width:14,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:2, type:"armor", name:"Gauntlets",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:148,cropY:126,width:15,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:3, type:"armor", name:"Boots",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:173,cropY:172,width:15,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:3, type:"armor", name:"Boots",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:197,cropY:173,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:4, type:"armor", name:"Belt",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:340,cropY:149,width:16,height:15,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:5, type:"armor", name:"Cape",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:4,cropY:173,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:5, type:"armor", name:"Cape",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:28,cropY:173,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:5, type:"armor", name:"Cape",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:52,cropY:173,width:16,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:6, type:"armor", name:"Shield",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:149,cropY:148,width:14,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:2, part:6, type:"armor", name:"Shield",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:173,cropY:148,width:14,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:0, part:6, type:"armor", name:"Shield",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:198,cropY:148,width:13,height:16,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:7, type:"armor", name:"Ring",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:78,cropY:175,width:12,height:12,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:7, type:"armor", name:"Ring",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:103,cropY:174,width:11,height:10,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeArmorModel({primary_attribute:3, part:8, type:"armor", name:"Necklace",
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:148,cropY:172,width:16,height:15,regX:10,regY:10,scale:0.8},
	}));

	items.push(new PrototypeConsumableItemModel({type:"consumable", name:"Health\nPotion", rating:1, health:50, cooldown:10,
		icon:{source:"assets/Graphics/System/Icons/IconSet.png",cropX:220,cropY:173,width:13,height:16,regX:10,regY:10,scale:0.8},
	}));

	var count = 0;
	items.forEach(function(item){
		item.save(function(){
			count++;
			if(count === items.length){
				console.log(count + " items are created");
				process.exit(0);
			}
		});
	});
}

function initPrototypeUnit(id, name, strength, dexterity, intelligence, vitality,
	sprite, portrait, index, level, exp, resource_type, resource,
	max_resource, health, damage, attack_speed, armor,
	movement_speed, critical_rate, critical_damage, radius, aggro_radius,
	range, type, team, health_color, damage_color,
	regX, regY, recruitable){
	return new PrototypeUnitModel({
		_id:id,
		name:name,
		sprite:sprite,
		portrait:portrait,
		index:index,
		level:level,
		exp:exp,
		resource_type:resource_type,
		resource:resource,
		max_resource:max_resource,
		health:health,
		strength:strength,
		dexterity:dexterity,
		intelligence:intelligence,
		vitality:vitality,
		attack_speed:attack_speed,
		armor:armor,
		movement_speed:movement_speed,
		critical_rate:critical_rate,
		critical_damage:critical_damage,
		radius:radius,
		aggro_radius:aggro_radius,
		range:range,
		type:type,
		team:team,
		health_color:health_color,
		damage_color:damage_color,
		regX:regX,
		regY:regY,
		recruitable:recruitable,
	});
}

function initMap(maps, npcs, monsters, act, chapter, merchant, recruiter, width, height, cols, rows, start_point){
	return new MapModel({
		maps:maps,
		npcs:npcs,
		monsters:monsters,
		act:act,
		chapter:chapter,
		merchant:merchant,
		recruiter:recruiter,
		width:width,
		height:height,
		cols:cols,
		rows:rows,
		start_point:start_point,
	});
}