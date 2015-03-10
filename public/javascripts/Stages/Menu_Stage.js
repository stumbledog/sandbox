function Menu_Stage(width, height){
	this.initialize(width, height);
}

createjs.extend(Menu_Stage, createjs.Stage);
Menu_Stage = createjs.promote(Menu_Stage, "Stage");

Menu_Stage.prototype.initialize = function(width, height){
	//this.width = width / 2;
	//this.height = height;
	this.canvas = document.getElementById("menu");
	this.canvas.width = 310;
	this.canvas.height = window.innerHeight;
	this.Stage_constructor(this.canvas);

	this.enableMouseOver();

}

Menu_Stage.prototype.addMenu = function(menu){
	this.addChild(menu);
	this.canvas.style.zIndex = 10;
	this.update();
}

Menu_Stage.prototype.removeMenu = function(menu){
	this.removeChild(menu);
	this.canvas.style.zIndex = -1;
	this.update();
}

Menu_Stage.prototype.resize = function(){
	this.children.forEach(function(store){
		//store.resize(this.canvas.width, this.canvas.height);
	}, this);
	this.update();
}