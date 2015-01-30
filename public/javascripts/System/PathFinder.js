function PathFinder(){}

PathFinder.flowField = function(block_map, destination){
	if(block_map[parseInt(destination.y/32)][parseInt(destination.x/32)] === 65535){
		destination = this.findClosestPoint2(block_map, destination);
	}
	var costed_map = [];
	var vector_map = [];
	block_map.forEach(function(row){
		costed_map.push(row.slice());
		vector_map.push(row.slice());
	});
	var queue = [];
	queue.push({x:parseInt(destination.x/32),y:parseInt(destination.y/32),cost:1});
	this.getVectorMap(vector_map, this.getCostedMap(queue, costed_map));
	//console.log(vector_map);
	return vector_map;
}

PathFinder.getCostedMap = function(queue, map){
	if(queue.length){
		var tile = queue.shift();
		if(map[tile.y] && map[tile.y][tile.x] && map[tile.y][tile.x] !== 65535 && (map[tile.y][tile.x] > tile.cost || map[tile.y][tile.x] === 'E')){
			map[tile.y][tile.x] = tile.cost;
			queue.push({x:tile.x+1,y:tile.y,cost:tile.cost+1});
			queue.push({x:tile.x-1,y:tile.y,cost:tile.cost+1});
			queue.push({x:tile.x,y:tile.y+1,cost:tile.cost+1});
			queue.push({x:tile.x,y:tile.y-1,cost:tile.cost+1});
		}
		return this.getCostedMap(queue, map);
	}else{
		return map;
	}
}

PathFinder.getVectorMap = function(vector_map, costed_map){
	for(var i = 0; i < costed_map.length ; i++){
		for(var j = 0; j < costed_map[i].length ; j++){
			if(costed_map[i][j] === 65535){
				vector_map[i][j] = {vx:0, vy:0, block:true};
			}else{
				var left = costed_map[i] && costed_map[i][j-1] && costed_map[i][j-1] !== 65535 ? costed_map[i][j-1] : null;
				var right = costed_map[i] && costed_map[i][j+1] && costed_map[i][j+1] !== 65535 ? costed_map[i][j+1] : null;
				var up = costed_map[i-1] && costed_map[i-1][j] && costed_map[i-1][j] !== 65535 ? costed_map[i-1][j] : null;
				var down = costed_map[i+1] && costed_map[i+1][j] && costed_map[i+1][j] !== 65535 ? costed_map[i+1][j] : null;

				var dx = left && right ? left - right : left ? -1 : right ? 1 : 0;
				var dy = up && down ? up - down : up ? -1 : down ? 1 : 0;

				if(!left && !right){
					dx = 0;
				}else{
					if(!left){
						if(right > costed_map[i][j]){
							left = right;
						}else{
							left = right +1;
						}
					}

					if(!right){
						if(left > costed_map[i][j]){
							right = left;
						}else{
							right = left +1;
						}
					}
					dx = left - right;
				}

				if(!up && !down){
					dy = 0;
				}else{
					if(!up){
						if(down > costed_map[i][j]){
							up = down;
						}else{
							up = down +1;
						}
					}

					if(!down){
						if(up > costed_map[i][j]){
							down = up;
						}else{
							down = up +1;
						}
					}
					dy = up - down;				
				}

				if(dx===0 && dy===0){
				}

				var distance = Math.sqrt(Math.pow(dx,2) + Math.pow(dy,2));
				vector_map[i][j] = distance === 0 ? {vx:0, vy:0, block:false} : {vx:dx/distance, vy:dy/distance, block:false};
			}
		}
	}
}

PathFinder.findPath = function(blocks, starting, destination){
	if(blocks[parseInt(destination.y/16)][parseInt(destination.x/16)]){
		destination = this.findClosestPoint(blocks, destination);
	}
	/*
	if(parseInt(destination.y/16) === parseInt(starting.y/16) && parseInt(destination.x/16) === parseInt(starting.x/16)){
		return [{x:parseInt(starting.x/16)*16+8,y:parseInt(starting.y/16)*16+8}];
	}*/

	var ret = this.aStar(blocks, starting, destination);

	ret.forEach(function(point){
		point.x = point.x*16+8;
		point.y = point.y*16+8;
	});
/*
	if(ret.length){
		ret.push(destination);
	}
*/

//	console.log(ret);
	return ret;
}

PathFinder.aStar = function(blocks, starting, destination){
	var grid = [];
	for(var i = 0, rows = blocks.length; i<rows; i++){
		var arr = [];
		for(var j = 0, cols = blocks[i].length; j<cols; j++){
			arr.push({g:0,f:0,h:0,b:blocks[i][j]?true:false,parent:null,pos:{x:j,y:i}});
		}
		grid.push(arr);
	}
	
	var start = {g:0, f:0, h:0, pos:{x:parseInt(starting.x/16),y:parseInt(starting.y/16)}};
	var end = {pos:{x:parseInt(destination.x/16),y:parseInt(destination.y/16)}};

	var openList = [start];
	var closedList = [];


	while(openList.length){
		var index = 0;
		for(var i = 0; i < openList.length; i++) {
			if(openList[i].f < openList[index].f) { index = i; }
		}
		var currentNode = openList[index];
		if(currentNode.pos.x == end.pos.x && currentNode.pos.y == end.pos.y){
			var curr = currentNode;
			var ret = [];
			while(curr.parent) {
				ret.push(curr.pos);
				curr = curr.parent;
			}
			return ret.reverse();
			//return this.filter(blocks, ret.reverse());
		}

		openList.splice(index,1);
		closedList.push(currentNode);

		var neighbors = this.neighbors(grid, currentNode);
		for(var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];
			if(closedList.indexOf(neighbor) > -1 || neighbor.b) {
				continue;
			}

			var gScore = currentNode.g + 1;
			var gScoreIsBest = false;

			if(openList.indexOf(neighbor) === -1){
				gScoreIsBest = true;
				neighbor.h = this.heuristic(neighbor.pos, end.pos);
				openList.push(neighbor);
			}
			else if(gScore < neighbor.g) {
				gScoreIsBest = true;
			}

			if(gScoreIsBest) {
				neighbor.parent = currentNode;
				neighbor.g = gScore;
				neighbor.f = neighbor.g + neighbor.h;
			}
		}
	}
	return [];
}

PathFinder.neighbors = function(grid, node){
	var ret = [];
	var x = node.pos.x;
	var y = node.pos.y;

	if(grid[y-1] && grid[y-1][x]) {
		ret.push(grid[y-1][x]);
	}
	if(grid[y+1] && grid[y+1][x]) {
		ret.push(grid[y+1][x]);
	}
	if(grid[y] && grid[y][x-1]) {
		ret.push(grid[y][x-1]);
	}
	if(grid[y] && grid[y][x+1]) {
		ret.push(grid[y][x+1]);
	}
	return ret;
}

PathFinder.heuristic = function(pos0, pos1) {
		var d1 = Math.pow(pos1.x - pos0.x,2);
		var d2 = Math.pow(pos1.y - pos0.y,2);
		return d1 + d2;
}

PathFinder.filter = function(blocks, path){
	var arr = [];
	path.forEach(function(node, index){
		var x = parseInt(node.pos.x/2);
		var y = parseInt(node.pos.y/2);
		if(index === path.length-1){
			arr.push({x:node.pos.x,y:node.pos.y});
		}else{
			if(blocks[y+1] && blocks[y] && blocks[y+1][x+1] && !blocks[y][x+1] && !blocks[y+1][x]
			|| blocks[y-1] && blocks[y] && blocks[y-1][x+1] && !blocks[y][x+1] && !blocks[y-1][x]
			|| blocks[y+1] && blocks[y] && blocks[y+1][x-1] && !blocks[y][x-1] && !blocks[y+1][x]
			|| blocks[y-1] && blocks[y] && blocks[y-1][x-1] && !blocks[y][x-1] && !blocks[y-1][x]){
				arr.push({x:node.pos.x,y:node.pos.y});
			}
		}
	});
	return arr;
}

PathFinder.findPath2 = function(blocks, starting, destination){

	if(blocks[parseInt(destination.y/32)][parseInt(destination.x/32)]){
		destination = this.findClosestPoint(blocks, destination);
	}

	var costs = [];
	blocks.forEach(function(row){
		var arr = [];
		row.forEach(function(cell){
			arr.push(0);
		});
		costs.push(arr);
	});

	this.calcCost(blocks, costs, parseInt(starting.x/32),parseInt(starting.y/32),0,1);

/*
	var string = "";
	costs.forEach(function(rows){
		rows.forEach(function(cell){
			string += cell+", ";
		});
		string += "\n";
	});
	console.log(string);
*/

	var path = this.getMinimum(blocks, costs, parseInt(destination.x/32), parseInt(destination.y/32));
	path = path.filter(function(point){
		var x = point.x;
		var y = point.y;
		try{
			return blocks[y+1][x+1] && !blocks[y][x+1] && !blocks[y+1][x]
				|| blocks[y-1][x+1] && !blocks[y][x+1] && !blocks[y-1][x]
				|| blocks[y+1][x-1] && !blocks[y][x-1] && !blocks[y+1][x]
				|| blocks[y-1][x-1] && !blocks[y][x-1] && !blocks[y-1][x];

		}catch(e){}
	});
	
	path.forEach(function(point){
		point.x = point.x*32+16;
		point.y = point.y*32+16;
	});

	path.push(destination);
	return path;
}

PathFinder.findClosestPoint = function(blocks, destination){	
	for(var i = 0.1;i<4;i+=0.1){
		for(j=0;j<8;j++){
			try{
				if(!blocks[parseInt(destination.y/16 + Math.sin(Math.PI/4 * j) * i)][parseInt(destination.x/16 + Math.cos(Math.PI/4 * j) * i)]){
					return {x:parseInt(destination.x/16 + Math.cos(Math.PI/4 * j) * i) * 16 + 8,y:parseInt(destination.y/16 + Math.sin(Math.PI/4 * j) * i) * 16 + 8};
				}
			}catch(e){}
		}
	}
	return [];
}

PathFinder.findClosestPoint2 = function(blocks, destination){	
	for(var i = 0.1;i<4;i+=0.1){
		for(j=0;j<8;j++){
			try{
				if(blocks[parseInt(destination.y/32 + Math.sin(Math.PI/4 * j) * i)][parseInt(destination.x/32 + Math.cos(Math.PI/4 * j) * i)] != 65535){
					return {x:parseInt(destination.x/32 + Math.cos(Math.PI/4 * j) * i) * 32 + 16,y:parseInt(destination.y/32 + Math.sin(Math.PI/4 * j) * i) * 32 + 16};
				}
			}catch(e){}
		}
	}
	return [];
}

PathFinder.calcCost = function(blocks, costs, x, y, direction, new_cost){
	if(y>=0 && y< blocks.length && x>=0 && x<blocks[y].length){
		if(!blocks[y][x]){
			var prev_cost = costs[y][x];
			if(!prev_cost || new_cost<prev_cost){
				costs[y][x] = new_cost;
				if(direction !== 1){
					this.calcCost(blocks, costs, x-1,y,3,new_cost+1);
				}
				if(direction !== 2){
					this.calcCost(blocks, costs, x,y+1,4,new_cost+1);
				}
				if(direction !== 3){
					this.calcCost(blocks, costs, x+1,y,1,new_cost+1);
				}
				if(direction !== 4){
					this.calcCost(blocks, costs, x,y-1,2,new_cost+1);
				}
			}
		}
	}
}

PathFinder.getMinimum = function(blocks, costs, x, y, path){
		var min = costs[y][x];
		var point = {};

		[[-1,0],[1,0],[0,-1],[0,1]].forEach(function(offset){
			var i = offset[0];
			var j = offset[1];
			try{
				if(blocks[y+i][x+j]===0 && costs[y+i][x+j] < min){
					min = costs[y+i][x+j];
					point.x = x+j;
					point.y = y+i;
				}
			}catch(e){}
		});
		if(min === 1){
			if (point){
				return [point];
			}else{
				return [];
			}
		}else{
			if(point){
				return this.getMinimum(blocks, costs, point.x,point.y, path).concat(point);
			}else{
				return this.getMinimum(blocks, costs, point.x,point.y, path);
			}
		}
	}