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
	units.push(initPrototypeUnit(  0, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 0, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  1, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 1, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  2, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 2, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  3, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 3, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  4, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 4, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  5, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 5, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  6, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 6, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));
	units.push(initPrototypeUnit(  7, "assets/Graphics/Characters/01 - Hero.png", "01 - Hero", "assets/Graphics/Faces/ds_face01-02.png", "ds_face01-02", 7, 1, 0, "fury", 0, 100, 100, 1, 30, 2, 1.5, 0.1, 2, 12, 80, 16, "hero", "player", "#0C0", "#C00"));

	units.push(initPrototypeUnit(100, "assets/Graphics/Characters/29 - Monster.png", "29 - Monster", null, null, 0, 1, 10, "mana", 100, 100, 5, 1, 60, 0, 1, 0, 1, 4, 80, 16, "monster", "enemy", "#C00", "#CC0"));
/*
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
				],
				tile_map:[
					[32,0,32,32],
				], 
				src:"assets/Graphics/Tilesets/A5/Overworld_TileA5.png",
				index:"A5/Overworld_TileA5",
				block:false
			},
			{
				tiles:[
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
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
				index:"E/Exterior_Walls_TileE",
				block:true
			}
		],
		[
			{
				prototype_unit:100,
				position:{x:160, y:160},
			}
		],
		1,
		1,
		640,
		640,
		20,
		20,
		[320,320]
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

function initPrototypeUnit(id, src, src_id, portrait_src, portrait_id,
	index, level, exp, resource_type, resource,
	max_resource, health, damage, attack_speed, armor,
	movement_speed, critical_rate, critical_damage, radius, aggro_radius,
	range, type, team, health_color, damage_color){
	var prototype_unit = new PrototypeUnitModel({
		_id:id,
		src:src,
		src_id:src_id,
		portrait_src:portrait_src,
		portrait_id:portrait_id,
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