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
	this.x=this.x>limit?limit:this.x<-limit?-limit:this.x;
	this.y=this.y>limit?limit:this.y<-limit?-limit:this.y;
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

Vector.prototype.mag = function(){
	return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
}

Vector.sub = function(v1, v2){
	return new Vector(v1.x-v2.x,v1.y-v2.y);
}

Vector.dist = function(v1, v2){
	return Math.sqrt(Math.pow(v1.x-v2.x,2)+Math.pow(v1.y-v2.y,2));
}

Vector.orthogonal = function(v1, v2){
	return new Vector(v2.y - v1.y, v1.x - v2.x);
}