function Map_Stage(){
	this.initialize(arguments);
}

Map_Stage.prototype = new createjs.Stage();

Map_Stage.prototype.stage_initialize = Map_Stage.prototype.initialize;

Map_Stage.prototype.initialize = function(){
	var args = Array.prototype.slice.call(arguments[0])[0];

	this.maps = args.maps;
	this.width = args.width;
	this.height = args.height;
	this.rows = args.rows;

	this.canvas = document.getElementById("bg");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
	this.stage_initialize(this.canvas);
	
	this.offsetX = this.offsetY = 0;

	var manifest = [];
	this.maps.forEach(function(map){
		manifest.push({src:map.file, id:map.file_id});
	});

	this.block = [];

	for(var i = 0 ;i < this.rows;i++){
		this.block.push([]);
	}

	this.loader = new createjs.LoadQueue(false);
	this.loader.loadManifest(manifest);

	this.loader.addEventListener("complete", function(event){
		this.maps.forEach(function(map){
			for(i=0;i<map.tiles.length;i++){
				for(j=0;j<map.tiles[i].length;j++){
					if(map.block){
						this.block[i][j] = map.tiles[i][j] > 0 ? 65535 : 'E';
					}
					if(map.tiles[i][j]>0){
						var index = map.tiles[i][j] - 1;
						var bitmap = new createjs.Bitmap(this.loader.getResult(map.file_id));
						bitmap.sourceRect = new createjs.Rectangle(map.tile_map[index][0],map.tile_map[index][1],map.tile_map[index][2],map.tile_map[index][3]);
						bitmap.cache(0,0,32,32);
						bitmap.x = j * 32;
						bitmap.y = i * 32;
						this.addChild(bitmap);
					}
				}
			}
		}, this);
		this.update();
	}.bind(this));
}

Map_Stage.prototype.getBlock = function(){
	return this.block;
}

Map_Stage.prototype.getSize = function(){
	return {width:this.width, height:this.height};
}