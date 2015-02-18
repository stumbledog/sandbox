function Home_Stage(){
	this.initialize();
}

createjs.extend(Home_Stage, createjs.Stage);
Home_Stage = createjs.promote(Home_Stage, "Stage");

Home_Stage.prototype.initialize = function(){
	this.canvas = document.getElementById("home");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.Stage_constructor(this.canvas);
	this.enableMouseOver();

	this.showSaveType();
}

Home_Stage.prototype.showSaveType = function(){
	this.local_save_button = new Button(
		{
			text:"Local Storage",
			style:"16px Arial",
			color:"#fff",
		},{
			padding:10,
			background:"#B64926",
			border_color:"#8E2800",
			border_width:2,
		}
	);

	this.network_save_button = new Button(
		{
			text:"Network Save",
			style:"16px Arial",
			color:"#fff",
		},{
			padding:10,
			background:"#7E8AA2",
			border_color:"#263248",
			border_width:2,
		}
	);

	this.local_save_button.x = this.canvas.width / 2 - this.local_save_button.getBounds().width - 50;
	this.network_save_button.x = this.canvas.width / 2 + 50;

	this.local_save_button.y = this.network_save_button.y = this.canvas.height / 2;
	this.local_save_button.cursor = this.network_save_button.cursor = "pointer";

	this.local_save_button.addEventListener("mousedown", function(event){
		console.log(event)
	});

	this.addChild(this.local_save_button, this.network_save_button);
	this.update();

	localStorage.button = JSON.stringify({name:"edward",age:32});
	console.log(JSON.parse(localStorage.button));
}

Home_Stage.prototype.resize = function(){
	this.local_save_button.x = this.canvas.width / 2 - this.local_save_button.getBounds().width - 50;
	this.network_save_button.x = this.canvas.width / 2 + 50;
	this.local_save_button.y = this.network_save_button.y = this.canvas.height / 2;
	this.update();
}

Home_Stage.prototype.createHero = function(){

}