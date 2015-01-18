function PathFinder(){}

PathFinder.findPath = function(blocks, starting, destination){

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
				if(!blocks[parseInt(destination.y/32 + Math.sin(Math.PI/4 * j) * i)][parseInt(destination.x/32 + Math.cos(Math.PI/4 * j) * i)]){
					return {x:destination.x + Math.cos(Math.PI/4 * j) * i * 32,y:destination.y + Math.sin(Math.PI/4 * j) * i * 32};
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