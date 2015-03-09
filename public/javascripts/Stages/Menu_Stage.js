function Menu_Stage(){
	this.initialize();
}

createjs.extend(Menu_Stage, createjs.Stage);
Menu_Stage = createjs.promote(Menu_Stage, "Stage");

Menu_Stage.prototype.initialize = function(width, height){
	this.width = width;
	this.height = height;
	this.canvas = document.getElementById("menu");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.Stage_constructor(this.canvas);

	this.enableMouseOver();

}

Menu_Stage.prototype.addMenu = function(menu){
	this.addChild(menu);
	this.canvas.style.zIndex = 10;
	this.update();
}

Menu_Stage.prototype.resize = function(){
	this.children.forEach(function(store){
		store.resize();
	});
	this.update();
}