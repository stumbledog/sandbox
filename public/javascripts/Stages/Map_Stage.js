function Map_Stage(){
	this.initialize(arguments);
}

createjs.extend(Map_Stage, createjs.Stage);
Map_Stage = createjs.promote(Map_Stage, "Stage");

Map_Stage.prototype.initialize = function(){
	var args = Array.prototype.slice.call(arguments[0])[0];
	this.maps = args.maps;
	this.width = args.width;
	this.height = args.height;
	this.rows = args.rows;
	this.cols = args.cols;
	this.npcs = args.npcs;

	this.canvas = document.getElementById("bg");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
	this.Stage_constructor(this.canvas);
	
	this.game = Game.getInstance();

	this.block = [];
	for(var i = 0 ;i < this.rows; i++){
		this.block.push([]);
		this.block.push([]);
	}

	this.loader = this.game.getLoader();

	//console.log(this);

	for(i = 0 ; i < this.cols ; i++){
		for(j = 0 ; j < this.rows ; j++){
			this.block[2*i][2*j] =  this.block[2*i+1][2*j] = this.block[2*i][2*j+1]= this.block[2*i+1][2*j+1] = 'E';
		}
	}

	this.maps.forEach(function(map){
		for(i=0;i<map.tiles.length;i++){
			for(j=0;j<map.tiles[i].length;j++){
				if(map.tiles[i][j]>0){
					var index = map.tiles[i][j] - 1;
					var bitmap = new createjs.Bitmap(this.loader.getResult(map.src.split('/').pop()));
					bitmap.sourceRect = new createjs.Rectangle(map.tile_map[index][0], map.tile_map[index][1], 32, 32);
					bitmap.cache(0,0,32,32);
					bitmap.x = j * 32;
					bitmap.y = i * 32;
					this.addChild(bitmap);
				}

				if(map.block && map.tiles[i][j] > 0){
					this.block[2*i][2*j] =  this.block[2*i+1][2*j] = this.block[2*i][2*j+1]= this.block[2*i+1][2*j+1] = 65535;
				}
			}
		}
	}, this);
	/*
	this.npcs.forEach(function(npc){
		this.block[parseInt(npc.position.y/16)-1][parseInt(npc.position.x/16)-1] = 65535;
		this.block[parseInt(npc.position.y/16)-1][parseInt(npc.position.x/16)] = 65535;
		this.block[parseInt(npc.position.y/16)][parseInt(npc.position.x/16)-1] = 65535;
		this.block[parseInt(npc.position.y/16)][parseInt(npc.position.x/16)] = 65535;
	}.bind(this));
	*/
	this.start_position = args.start_point;
	this.update();
}

Map_Stage.prototype.getStartPosition = function(){
	return {x:this.start_position[0], y:this.start_position[1]}
}

Map_Stage.prototype.getBlock = function(){
	return this.block;
}

Map_Stage.prototype.getSize = function(){
	return {width:this.width, height:this.height};
}