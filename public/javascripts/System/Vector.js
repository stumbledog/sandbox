function Vector(x, y){
	this.x = x;
	this.y = y;
}

Vector.prototype.add = function(target){
	this.x+=target.x;
	this.y+=target.y;
}

Vector.prototype.sub = function(target){
	this.x-=target.x;
	this.y-=target.y;
}

Vector.prototype.mult = function(multiplier){
	this.x*=multiplier;	
	this.y*=multiplier;	
}

Vector.prototype.div = function(division){
	this.x/=division;
	this.y/=division;
}

Vector.prototype.limit = function(limit){
	if(this.mag() > limit){
		this.normalize();
		this.mult(limit);
	}
}

Vector.prototype.orthogonal = function(){
	var temp = this.x;
	this.x = -this.y;
	this.y = this.x;
}

Vector.prototype.normalize = function(){
	var mag = this.mag();
	if(mag !== 0){
		this.x/=mag;
		this.y/=mag;		
	}
}

Vector.prototype.rotate = function(degree){
	var x = this.x;
	var y = this.y;
	this.x = x * Math.cos(degree/180*Math.PI) - y * Math.sin(degree/180*Math.PI);
	this.y = x * Math.sin(degree/180*Math.PI) + y * Math.cos(degree/180*Math.PI);
}

Vector.prototype.getRadian = function(){
	return Math.atan2(this.y, this.x);
}

Vector.prototype.getDegree = function(){
	return Math.atan2(this.y, this.x)/Math.PI*180;
}

Vector.prototype.diffDegree = function(target){
	var degree1 = this.getDegree();
	var degree2 = target.getDegree();
	var diff = Math.abs(degree1 - degree2);
	return diff > 180 ? 360 - diff : diff;
}

Vector.prototype.mag = function(){
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}

Vector.sub = function(v1, v2){
	return new Vector(v1.x-v2.x,v1.y-v2.y);
}

Vector.getRadian = function(v1, v2){
	return Math.atan2(v1.y - v2.y, v1.x - v2.x);
}

Vector.getDegree = function(v1, v2){
	return Math.atan2(v1.y - v2.y, v1.x - v2.x)/Math.PI*180;
}

Vector.dist = function(v1, v2){
	return Math.sqrt(Math.pow(v1.x-v2.x,2)+Math.pow(v1.y-v2.y,2));
}

Vector.orthogonal = function(v1, v2){
	return new Vector(v2.y - v1.y, v1.x - v2.x);
}