function Map(image, tiles, tile_map){
	this.initialize(image, tiles, tile_map);
}

Map.prototype = new createjs.Container();

Map.prototype.container_initialize = Map.prototype.initialize;

Map.prototype.initialize = function(image, tiles, tile_map){
	var maps = arguments;

	for(index in maps){
		console.log(maps[index]);
	}

	for(i=0;i<tiles.length;i++){
		for(j=0;j<tiles[i].length;j++){
			if(tiles[i][j]>0){
				var index = tiles[i][j] - 1;
				var bitmap = new createjs.Bitmap(image);
				bitmap.sourceRect = new createjs.Rectangle(tile_map[index][0],tile_map[index][1],tile_map[index][2],tile_map[index][3]);
				bitmap.cache(0,0,32,32);
				bitmap.x = j * 32;
				bitmap.y = i * 32;
				this.addChild(bitmap);
			}
		}
	}
}

Map.prototype.getBlock = function(){
	
}