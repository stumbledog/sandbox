function MenuStage(id, width, height){
	this.initialize(id, width, height);
}

createjs.extend(MenuStage, createjs.Stage);
MenuStage = createjs.promote(MenuStage, "Stage");

MenuStage.prototype.initialize = function(id, width, height){
	this.canvas = document.getElementById(id);
	this.canvas.width = width;
	this.canvas.height = height;
	this.Stage_constructor(this.canvas);

	this.enableMouseOver();
}

MenuStage.prototype.open = function(){
	this.canvas.style.zIndex = 10;
	this.update();
}

MenuStage.prototype.close = function(){
	this.canvas.style.zIndex = -1;
	this.removeAllChildren();
	this.update();
}

MenuStage.prototype.resize = function(){
	this.update();
}