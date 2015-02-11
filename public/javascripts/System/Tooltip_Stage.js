function Tooltip_Stage(width, height, rows){
	this.initialize(width, height, rows);
}

createjs.extend(Tooltip_Stage, createjs.Stage);
Tooltip_Stage = createjs.promote(Tooltip_Stage, "Stage");

Tooltip_Stage.prototype.initialize = function(){
	this.canvas = document.getElementById("tooltip");
	this.canvas.width = 300;
	this.canvas.height = 150;

	this.Stage_constructor(this.canvas);
	this.skill_container = new createjs.Container();
	this.skill_container_bg = new createjs.Shape();
	this.skill_name = new createjs.Text("","16px Arial","#FFF");

	this.skill_cost = new createjs.Text("","12px Arial","#FFF0A5");
	this.skill_cost_amount = new createjs.Text("","12px Arial","#FFB03B");
	this.skill_cost_type = new createjs.Text("","12px Arial","#FFF0A5");

	this.skill_cooldown = new createjs.Text("","12px Arial","#FFF0A5");
	this.skill_cooldown_amount = new createjs.Text("","12px Arial","#FFB03B");
	this.skill_cooldown_seconds = new createjs.Text("","12px Arial","#FFF0A5");

	this.skill_description = new createjs.Text("","12px Arial","#FFF0A5");
	this.skill_name.x = this.skill_name.y = this.skill_cost.x = this.skill_cooldown.x = this.skill_description.x = 8;
	this.skill_cost.y = this.skill_cost_amount.y = this.skill_cost_type.y = 30;
	this.skill_cooldown.y = this.skill_cooldown_amount.y = this.skill_cooldown_seconds.y = 44;
	this.skill_description.y = 58;
	this.skill_description.lineWidth = 290;
	this.skill_container.addChild(this.skill_container_bg, this.skill_name, this.skill_cost, this.skill_cost_amount, this.skill_cost_type, 
		this.skill_cooldown, this.skill_cooldown_amount, this.skill_cooldown_seconds, this.skill_description);
}

Tooltip_Stage.prototype.showSkillTooltip = function(event, skill){
	this.canvas.style.bottom = 90 + "px";
	this.canvas.style.left = window.innerWidth/2 - 150 + "px";
	this.canvas.style.display = "block";
	this.removeAllChildren();
	this.skill_name.text = skill.name;

	this.skill_cost.text = "Cost:";
	this.skill_cost_amount.text = skill.cost;
	this.skill_cost_type.text = skill.resource;
	this.skill_cost_amount.x = 38;
	this.skill_cost_type.x = 40 + this.skill_cost_amount.getMeasuredWidth();

	this.skill_cooldown.text = "Cooldown:";
	this.skill_cooldown_amount.text = skill.cooldown;
	this.skill_cooldown_seconds.text = "seconds";
	this.skill_cooldown_amount.x = 69;
	this.skill_cooldown_seconds.x = 71 + this.skill_cooldown_amount.getMeasuredWidth();

	this.skill_description.text = skill.description;
	var height = this.skill_description.getMeasuredHeight() + 68;

	this.canvas.style.height = height + "px";
	this.canvas.height = height;
	this.skill_container_bg.graphics.c().s("#FFF").ss(6).f("#2F343B").dr(0,0,300,height);
	this.addChild(this.skill_container);
	this.update();
}

Tooltip_Stage.prototype.hideSkillTooltip = function(){
	this.removeAllChildren();
	this.update();
	this.canvas.style.display = "none";
}