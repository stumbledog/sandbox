mongoose = require('mongoose');
Schema = mongoose.Schema;
fs = require('fs');
require('./models/PrototypeUnitModel');
require('./models/MapModel');

mongoose.connect('mongodb://localhost/condottiere');


var connection = mongoose.connection;
connection.on("error", console.error.bind(console, 'connection error:'));
connection.once("open", function(){
	PrototypeUnitModel.remove().exec().then(function(number_of_deleted_prototype_unit){
		console.log(number_of_deleted_prototype_unit + " prototype units are deleted");
		return MapModel.remove().exec();
	}).then(function(number_of_deleted_map){
		console.log(number_of_deleted_map + " maps are deleted");
		savePrototypeUnit();
	});
});

function savePrototypeUnit(){
	var units = [];
	units.push(initPrototypeUnit(  0, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 0, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  1, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 1, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  2, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 2, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  3, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 3, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  4, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 4, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  5, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 5, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  6, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 6, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));
	units.push(initPrototypeUnit(  7, 'Hero', "assets/Graphics/Characters/01 - Hero.png", "assets/Graphics/Faces/ds_face01-02.png", 7, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00", 0, 0));

	units.push(initPrototypeUnit(100, 'slaim', "assets/Graphics/Characters/29 - Monster.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 1, 0, 1, 4, 80, 16, "monster", "enemy", "#C00", "#CC0", 0, 8));
	units.push(initPrototypeUnit(101, 'Item Merchant', "assets/Graphics/Characters/12 - Merchant.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0));
	units.push(initPrototypeUnit(102, 'Merchant', "assets/Graphics/Characters/12 - Merchant.png", null, 1, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0));
	units.push(initPrototypeUnit(103, 'Merchant', "assets/Graphics/Characters/12 - Merchant.png", null, 2, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0));
	units.push(initPrototypeUnit(104, 'Battlemaster', "assets/Graphics/Characters/23 - Soldier.png", null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 0.5, 0, 1, 12, 80, 16, "npc", "player", "#C00", "#CC0", 0, 0));

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
					[32*8,	32*3],
					[32*9,	32*3],
					[32*10,	32*3],
					[32*11,	32*3],
					[32*12,	32*3],
					[32*8,	32*4],
					[32*9,	32*4],
					[32*10,	32*4],
					[32*11,	32*4],
					[32*12,	32*4],
					[32*8,	32*5],
					[32*9,	32*5],
					[32*10,	32*5],
					[32*11,	32*5],
					[32*12,	32*5],
					[32*8,	32*6],
					[32*9,	32*6],
					[32*10,	32*6],
					[32*11,	32*6],
					[32*12,	32*6],
					[32*14,	32*3],
					[32*14,	32*4],
					[32*5,	32*13],
					[32*6,	32*13],
					[32*7,	32*13],
					[32*5,	32*14],
					[32*6,	32*14],
					[32*7,	32*14],
					[32*5,	32*15],
					[32*6,	32*15],
					[32*7,	32*15],
				], 
				src:"assets/Graphics/Tilesets/B/Exterior_Forest_TileB.png",
				block:true
			}
		],
		[
			{
				prototype_unit:101,
				position:{x:32*4, y:32*4},
			},
			{
				prototype_unit:102,
				position:{x:32*6, y:32*4},
			},
			{
				prototype_unit:103,
				position:{x:32*3, y:32*7},
			},
			{
				prototype_unit:104,
				position:{x:32*7, y:32*7},
			}

		],
		1,
		1,
		320,
		320,
		10,
		10,
		[160,160]
	));
	var count = 0;
	maps.forEach(function(map){
		map.save(function(){
			count++;
			if(count === maps.length){
				console.log(count + " maps are created");
				process.exit(0);
			}
		});
	});	
}

function initPrototypeUnit(id, name, src, portrait_src,
	index, level, exp, resource_type, resource,
	max_resource, health, damage, attack_speed, armor,
	movement_speed, critical_rate, critical_damage, radius, aggro_radius,
	range, type, team, health_color, damage_color,
	regX, regY){
	var prototype_unit = new PrototypeUnitModel({
		_id:id,
		name:name,
		src:src,
		portrait_src:portrait_src,
		index:index,
		level:level,
		exp:exp,
		resource_type:resource_type,
		resource:resource,
		max_resource:max_resource,
		health:health,
		damage:damage,
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
	});

	return prototype_unit;
}

function initMap(maps, units, act, chapter, width, height, cols, rows, start_point){
	var map = new MapModel({
		maps:maps,
		units:units,
		act:act,
		chapter:chapter,
		width:width,
		height:height,
		cols:cols,
		rows:rows,
		start_point:start_point,
	});

	return map;
}