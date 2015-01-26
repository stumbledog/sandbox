function Unit_Stage(){
	this.initialize();
}

Unit_Stage.prototype = new createjs.Stage();

Unit_Stage.prototype.stage_initialize = Unit_Stage.prototype.initialize;

Unit_Stage.prototype.initialize = function(){
	this.canvas = document.getElementById("unit");

	this.stage_initialize(this.canvas);
	/*
	this.on("stagemousemove", function(event){
		console.log(this.getObjectUnderPoint(event.stageX,event.stageY,2));
	},this);*/

}