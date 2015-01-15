function Cursor(image){
	this.initialize(image);
}

Cursor.prototype = new createjs.Bitmap();

Cursor.prototype.Bitmap_initialize = Cursor.prototype.initialize;

Cursor.prototype.initialize = function(image){
	this.Bitmap_initialize(image);
	this.move_cursor = new createjs.Rectangle(292,100,16,16);
	this.attack_cursor = new createjs.Rectangle(294,29,16,16);
	this.move();
}

Cursor.prototype.move = function(){
	this.sourceRect = this.move_cursor;
}

Cursor.prototype.attack = function(){
	this.sourceRect = this.attack_cursor;
}