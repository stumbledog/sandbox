function PathFinder(){}

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