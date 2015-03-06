function NPC(builder){
	this.npc_initialize(builder);
}

NPC.prototype = new Unit();
NPC.prototype.constructor = NPC;
NPC.prototype.unit_initialize = NPC.prototype.initialize;

NPC.prototype.npc_initialize = function(builder){
	this.unit_initialize(builder);
	this.outline.gotoAndPlay("stop");
	this.sprite.gotoAndPlay("stop");
	this.radius = 16;
	this.health_color = this.name_text_color = "#FFB03B";

	this.name_text = new OutlineText(this.name,"bold 6px Arial",this.name_text_color,"#000",2);
	this.name_text.textAlign("center");
	this.name_text.y = -20;

	this.team = "NPC";

	this.addChild(this.name_text);

	this.initEventListener();
}

NPC.prototype.initEventListener = function(){
	this.addEventListener("mousedown", function(event){
		if(event.nativeEvent.button == 2){
			this.stage.hero.order = {action:"interact_npc", npc:this, map:this.stage.hero.findPath(this)};
		}else{
			
		}
	}.bind(this));

	this.addEventListener("rollover", function(event){
		this.outline.uncache();
		this.outline.filters = [new createjs.ColorFilter(0,0,0,1,255,255,255,0)];
		this.outline.cache(-12,-16,24,32);
		this.outline.visible = true;
		this.name_text.setColor("#fff");
		this.shadow = null;
	}.bind(this));

	this.addEventListener("rollout", function(event){
		this.outline.visible = false;
		this.outline.filters = null;
		this.outline.uncache();
		this.name_text.setColor(this.name_text_color);
		this.shadow = new createjs.Shadow("#333",3,3,10);
	}.bind(this));
}

NPC.prototype.tick = function(){
}