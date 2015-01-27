
function init(){
	var stage = new Test_Stage();
	stage.on("stagemousemove", function(event){
		console.log(event);
	});	
}

/*
function Test_Stage(){
	this.initialize();
};

Test_Stage.prototype = new createjs.Stage();
Test_Stage.prototype.stage_initialize = Test_Stage.prototype.initialize;

Test_Stage.prototype.initialize = function(){
	var canvas = document.getElementById("test");
	this.stage_initialize(canvas);
}
*/

function Test_Stage(label) {
	var canvas = document.getElementById("test");	
	this.Stage_constructor(canvas);
}

createjs.extend(Test_Stage, createjs.Stage);

Test_Stage = createjs.promote(Test_Stage, "Stage");

init();