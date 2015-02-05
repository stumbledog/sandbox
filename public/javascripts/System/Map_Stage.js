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
	this.cols = args.cols;

	this.canvas = document.getElementById("bg");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	
	this.stage_initialize(this.canvas);
	
	this.game = Game.getInstance();

	this.block = [];
	for(var i = 0 ;i < this.rows; i++){
		this.block.push([]);
		this.block.push([]);
	}

	var poly_contour = [], poly_holes = [], poly_holes_map = [];
	var set = 1;
	poly_contour.push(new poly2tri.Point(0,0));
	poly_contour.push(new poly2tri.Point(0,this.height));
	poly_contour.push(new poly2tri.Point(this.width,this.height));
	poly_contour.push(new poly2tri.Point(this.width,0));
	/*
	for(var i=0;i<this.cols;i++){
		poly_contour.push(new poly2tri.Point(i*32,0));
	}
	for(var i=0;i<this.rows;i++){
		poly_contour.push(new poly2tri.Point(640,i*32));
	}
	for(var i=0;i<this.cols;i++){
		poly_contour.push(new poly2tri.Point(640-i*32,640));
	}
	for(var i=0;i<this.rows;i++){
		poly_contour.push(new poly2tri.Point(0,640-i*32));
	}
	*/
	this.loader = this.game.getLoader();
	this.maps.forEach(function(map){
		for(i=0;i<map.tiles.length;i++){
			for(j=0;j<map.tiles[i].length;j++){
				if(map.tiles[i][j]>0){
					var index = map.tiles[i][j] - 1;
					var bitmap = new createjs.Bitmap(this.loader.getResult(map.id));
					bitmap.sourceRect = new createjs.Rectangle(map.tile_map[index][0],map.tile_map[index][1],map.tile_map[index][2],map.tile_map[index][3]);
					bitmap.cache(0,0,32,32);
					bitmap.x = j * 32;
					bitmap.y = i * 32;
					this.addChild(bitmap);
				}
				if(map.block){
					this.block[2*i][2*j] =  this.block[2*i+1][2*j] = this.block[2*i][2*j+1]= this.block[2*i+1][2*j+1] = map.tiles[i][j] > 0 ? 65535 : 'E';
					if(map.tiles[i][j] > 0){
						if(!poly_holes_map[i*32]){
							poly_holes_map[i*32] = [];
						}

						if(!poly_holes_map[i*32+32]){
							poly_holes_map[i*32+32] = [];
						}

						poly_holes_map[i*32][j*32] = set;
						poly_holes_map[i*32][j*32+32] = set;
						poly_holes_map[i*32+32][j*32] = set;
						poly_holes_map[i*32+32][j*32+32] = set;

						set++;

						poly_holes.push(new poly2tri.Point(j*32,i*32));
						poly_holes.push(new poly2tri.Point(j*32+32,i*32));
						poly_holes.push(new poly2tri.Point(j*32+32,i*32+32));
						poly_holes.push(new poly2tri.Point(j*32,i*32+32));
					}
				}
			}
		}
	}, this);

	var swctx;
	var error_points;
	try {
		swctx = new poly2tri.SweepContext(poly_contour, {cloneArrays: true});
		swctx.addHoles(poly_holes);
		swctx.triangulate();
	} catch (e) {
		window.alert(e);
		error_points = e.points;
	}
	var triangles = swctx.getTriangles() || [];
	this.nav_mesh = [];
	triangles.forEach(function(triangle){
		var is_hole = false;
		var tri_points = triangle.getPoints();
		if(poly_holes_map[tri_points[0].y] && poly_holes_map[tri_points[1].y] && poly_holes_map[tri_points[2].y] && 
			poly_holes_map[tri_points[0].y][tri_points[0].x] && poly_holes_map[tri_points[1].y][tri_points[1].x] && poly_holes_map[tri_points[2].y][tri_points[2].x] &&
			poly_holes_map[tri_points[0].y][tri_points[0].x] === poly_holes_map[tri_points[1].y][tri_points[1].x] &&
			poly_holes_map[tri_points[1].y][tri_points[1].x] === poly_holes_map[tri_points[2].y][tri_points[2].x] &&
			poly_holes_map[tri_points[2].y][tri_points[2].x] === poly_holes_map[tri_points[0].y][tri_points[0].x]){
			is_hole = true;
		}

		if(!is_hole){
			this.nav_mesh.push(triangle);
		}
	}, this);

	this.points = poly_contour.concat(poly_holes);

	this.points.forEach(function(point){
		point.g = 0;
		point.f = 0;
		point.h = 0;
		point.parent = null;

		point.neighbor_triangles = [];
		this.nav_mesh.forEach(function(mesh){
			if(mesh.containsPoint(point)){
				point.neighbor_triangles.push(mesh);
			}
		});
	},this);

	this.nav_mesh.forEach(function(triangle){
		triangle.shape = new createjs.Shape();
		triangle.shape.graphics.s("#c0c").ss(1)
			.mt(triangle.GetPoint(0).x,triangle.GetPoint(0).y)
			.lt(triangle.GetPoint(1).x,triangle.GetPoint(1).y)
			.lt(triangle.GetPoint(2).x,triangle.GetPoint(2).y)
			.lt(triangle.GetPoint(0).x,triangle.GetPoint(0).y);
		this.addChild(triangle.shape);
	}, this);

	this.update();
}

Map_Stage.prototype.getBlock = function(){
	return this.block;
}

Map_Stage.prototype.getSize = function(){
	return {width:this.width, height:this.height};
}

Map_Stage.prototype.getTriangles = function(p){
	var triangles = [];
	this.nav_mesh.forEach(function(triangle){
		var p0 = triangle.getPoint(0);
		var p1 = triangle.getPoint(1);
		var p2 = triangle.getPoint(2);

		var A = 1/2 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
		var sign = A < 0 ? -1 : 1;
		var s = (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * p.x + (p0.x - p2.x) * p.y) * sign;
		var t = (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * p.x + (p1.x - p0.x) * p.y) * sign;

		if(s >= 0 && t >= 0 && (s + t) <= 2 * A * sign){
			triangles.push(triangle);
		}
	});
	return triangles;
}

Map_Stage.prototype.getPath = function(start, end){


	/*
	start.neighbor_triangles = this.getTriangles(start);
	end.neighbor_triangles = this.getTriangles(end);
	start.g = 0;
	start.h = Vector.dist(start, end);
	start.f = start.h;
	start.parent = null;

	var openList = [start];
	var closedList = [];

	while(openList.length){
		var index = 0;
		for(var i = 0;i<openList.length;i++){
			if(openList[i].f < openList[index].f) { index = i; }
		}
		var currentNode = openList[index];
		var ret = [];
		start.neighbor_triangles.forEach(function(start_tri){
			end.neighbor_triangles.forEach(function(end_tri){
				if(start_tri === end_tri){
					var curr = currentNode;					
					while(curr.parent){
						ret.push(curr);
						curr = curr.parent;
					}
					return;
				}
			});
		});

		if(ret.length){
			return ret.reverse();
		}

		openList.splice(index,1);
		closedList.push(currentNode);

		var neighbors = [];
		currentNode.visit = true;
		currentNode.neighbor_triangles.forEach(function(triangle){
			triangle.getPoints().forEach(function(point){
				if(neighbors.indexOf(point) === -1 && !point.visit){
					neighbors.push(point);
				}
			});
		});

		for(var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];
			if(closedList.indexOf(neighbor) > -1){
				continue;
			}

			var gScore = currentNode.g + 1;
			var gScoreIsBest = false;

			if(openList.indexOf(neighbor) === -1){
				gScoreIsBest = true;
				neighbor.h = Vector.dist(neighbor, end);
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
	*/
}

function triarea2(a,b,c){
	var ax = b.x - a.x;
	var ay = b.y - a.y;
	var bx = c.x - a.x;
	var by = c.y - a.y;
	return bx * ay - ax * by;
}

function vequal(a,b){
	return Vector.dist(a,b) < 0.001;
}