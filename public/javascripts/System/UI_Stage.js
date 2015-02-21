function UI_Stage(){
	this.initialize();
}

createjs.extend(UI_Stage, createjs.Stage);
UI_Stage = createjs.promote(UI_Stage, "Stage");

UI_Stage.prototype.initialize = function(){
	this.canvas = document.getElementById("ui");
	this.canvas.width = 275;
	this.canvas.height = 82;

	this.Stage_constructor(this.canvas);
	this.enableMouseOver();

	this.game = Game.getInstance();
	this.map = this.game.getMapStage();
	this.loader = this.game.getLoader();
	this.tooltip_stage = this.game.getTooltipStage();

	this.skills = [];
}

UI_Stage.prototype.initHeroUI = function(hero){
	this.hero = hero;
	this.renderPortrait();
	this.renderSkill();
	this.renderExpBar();
	this.renderHealthBar();
	this.update();
}

UI_Stage.prototype.renderPortrait = function(){
	var shape = new createjs.Shape();
	shape.graphics.lf(["#FFF","#3E606F"],[0,1],36,0,36,72).dr(0,0,72,72);
	var portrait = this.hero.getPortrait();
	portrait.scaleX = portrait.scaleY = 0.75;
	this.level_border = new createjs.Shape();
	this.level = new createjs.Text(this.hero.level,"11px Arial","#fff");
	this.level_border.graphics.f("#000").lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],8,0,8,16).dr(0,0,this.level.getMeasuredWidth()+2,16);
	this.level.textAlign = "center";
	this.level.textBaseline = "middle";
	this.level.x = this.level.getMeasuredWidth()/2+1;
	this.level.y = 8;
	this.addChild(shape, portrait, this.level_border, this.level);
}

UI_Stage.prototype.renderSkill = function(){
	if(this.hero.skills){
		this.skills['q'] = this.renderSkillButton('Q',0, this.hero.skills['q']);
		this.skills['w'] = this.renderSkillButton('W',1, this.hero.skills['w']);
		this.skills['e'] = this.renderSkillButton('E',2, this.hero.skills['e']);
		this.skills['r'] = this.renderSkillButton('R',3, this.hero.skills['r']);
	}
}

UI_Stage.prototype.renderSkillButton = function(hotkey, index, skill){
	var container = new createjs.Container();
	container.x = (index + 1) * 50 + 25;
	container.y = 34;
	var border = new createjs.Shape();
	border.graphics.ss(1).s("#fff").f("#ccc").dr(0,0,50,50);
	var hotkey_border = new createjs.Shape();
	hotkey_border.graphics.f("#000").lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],8,0,8,16).dr(0,0,16,16);
	var hotkey_text = new createjs.Text(hotkey,"12px monospace","#FFF");
	hotkey_text.textAlign = "center";
	hotkey_text.textBaseline = "middle";
	hotkey_text.x = 7;
	hotkey_text.y = 8;
	var icon = new createjs.Bitmap(this.loader.getResult(skill.name));
	var available = new createjs.Shape();
	available.graphics.f("#c00").dr(0,0,50,50);
	available.alpha = 0;
	var cooldown = new createjs.Shape();
	cooldown.graphics.f("#666").dr(0,0,50,50);
	cooldown.alpha = 0.8;
	var mask = new createjs.Shape();
	mask.graphics.mt(25,25).arc(25,25,50,-Math.PI/2,-Math.PI/2,true);
	cooldown.mask = mask;
	var cc_text = new OutlineText("","24px Arial", "#fff", "#000", 5);
	cc_text.y = 25;
	cc_text.textBaseline("middle");
	container.addChild(border, icon, hotkey_border, hotkey_text, available, cooldown, cc_text);
	this.addChild(container);

	icon.on("rollover", function(event){
		this.tooltip_stage.showSkillTooltip(event, skill);
	}.bind(this));

	icon.on("rollout", function(event){
		this.tooltip_stage.hideSkillTooltip();
	}.bind(this));
	
	return container;
}

UI_Stage.prototype.refreshSkillButton = function(){
	for(key in this.skills){
		var skill_button = this.skills[key];
		var skill = this.hero.skills[key];
		var available = skill_button.children[4];
		if(skill.cost <= this.hero.resource){
			available.alpha = 0;
		}else{
			available.alpha = 0.5;
		}
	}
	this.update();
}

UI_Stage.prototype.renderCooldown = function(key, remain_cc, cc){
	var skill = this.skills[key];
	var mask = skill.children[5].mask;
	var text = skill.children[6];

	mask.graphics.c().mt(25,25).arc(25,25,50,-Math.PI/2,-Math.PI*2*remain_cc/cc-Math.PI/2, true);
	remain_cc = remain_cc > 1 ? Math.floor(remain_cc) : remain_cc === 0 ? "" : Math.floor(remain_cc*10)/10;
	text.x = 25 - text.getMeasuredWidth() / 2;
	text.setText(remain_cc);

	this.update();
}

UI_Stage.prototype.renderHealthBar = function(){
	var container = new createjs.Container();
	container.x = 74;
	var health_bar_border = new createjs.Shape();
	health_bar_border.graphics.lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],0,0,0,20).dr(0,0,200,20);

	var resource_bar_border = new createjs.Shape();
	resource_bar_border.graphics.lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],0,20,0,32).dr(0,20,200,12);

	this.healbar = new createjs.Shape();
	this.healbar.graphics.lf(["#96ED89","#45BF55","#167F39"],[0,0.5,1],0,0,0,20).dr(1,1,198,18);

	this.resource_color = this.hero.resource_type === "mana"?["#1A8BB2","#127899","#0E5066"]:this.hero.resource_type === "fury"?["#FF1D23","#94090D","#450003"]:["#FFF5A5","#FFE30A","#7F7105"];

	this.resource_bar = new createjs.Shape();
	this.resource_bar.graphics.lf(this.resource_color,[0,0.5,1],0,21,0,31).dr(1,21,198*this.hero.resource/this.hero.max_resource,10);
	this.health_text = new OutlineText(Math.round(this.hero.health)+"/"+Math.round(this.hero.max_health),"bold 10px Arial","#fff","#000",2);
	this.health_text.textAlign("center");
	this.health_text.x = 100;
	this.health_text.y = 6;

	this.resource_text = new OutlineText(Math.round(this.hero.resource)+"/"+Math.round(this.hero.max_resource),"bold 10px Arial","#fff","#000",2);
	this.resource_text.textAlign("center");
	this.resource_text.x = 100;
	this.resource_text.y = 22;

	container.addChild(health_bar_border, resource_bar_border, this.healbar, this.resource_bar, this.health_text, this.resource_text);
	this.addChild(container);
}

UI_Stage.prototype.renderExpBar = function(){
	var container = new createjs.Container();
	container.y = 72;
	var border = new createjs.Shape();
	border.graphics.lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],0,0,0,10).dr(0,0,72,10);
	var exp_cap = this.hero.level * 100;
	this.exp_bar = new createjs.Shape();
	this.exp_bar.graphics.lf(["#FFE11A","#FD7400"],[0,1],0,0,0,8).dr(1,1,70 * this.hero.exp / exp_cap,8);
	this.exp_text = new createjs.Text(Math.round(this.hero.exp)+"/"+exp_cap,"bold 10px Arial","#fff");
	this.exp_text.textAlign = "center";
	this.exp_text.x = 36;
	this.exp_text.y = 1;
	container.addChild(border, this.exp_bar, this.exp_text);
	this.addChild(container);
}

UI_Stage.prototype.refreshExpBar = function(){
	var exp_cap = this.hero.level * 100;
	this.exp_bar.graphics.c().lf(["#FFE11A","#FD7400"],[0,1],0,0,0,8).dr(1,1,70 * this.hero.exp / exp_cap,8);
	this.exp_text.text = Math.round(this.hero.exp)+"/"+exp_cap;
	this.level.text = this.hero.level;
	this.level.x = this.level.getMeasuredWidth()/2+1;
	this.level_border.graphics.c().f("#000").lf(["#4B4B4B","#414141","#373737"],[0,0.5,1],8,0,8,16).dr(0,0,this.level.getMeasuredWidth()+2,16);
	this.update();
}

UI_Stage.prototype.refreshHealthBar = function(){
	this.health_text.setText(Math.round(this.hero.health)+"/"+Math.round(this.hero.max_health));
	this.healbar.graphics.c().lf(["#96ED89","#45BF55","#167F39"],[0,0.5,1],0,0,0,20).dr(1,1,198*this.hero.health/this.hero.max_health,18);
	this.update();
}

UI_Stage.prototype.refreshResourceBar = function(){
	this.resource_text.setText(Math.round(this.hero.resource)+"/"+Math.round(this.hero.max_resource));
	this.resource_bar.graphics.c().lf(this.resource_color,[0,0.5,1],0,21,0,31).dr(1,21,198*this.hero.resource/this.hero.max_resource,10);
	this.update();
}