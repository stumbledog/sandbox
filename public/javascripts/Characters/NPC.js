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
	this.initEventListener();
	this.radius = 16;
	this.health_color = this.name_text_color = "#FFB03B";
	this.name_text = new OutlineText(this.name,"bold 6px Arial",this.name_text_color,"#000",2);
	this.name_text.textAlign("center");
	this.name_text.y = -20;
	this.addChild(this.name_text);
	this.store = new Store(this.name);
}

NPC.prototype.initEventListener = function(){
	this.addEventListener("mousedown", function(event){
		if(event.nativeEvent.button == 2){
			this.stage.hero.order = {action:"interact_npc", npc:this, map:this.stage.hero.findPath(this)};
		}else{
			
		}
	}.bind(this));

	this.addEventListener("rollover", function(event){
		this.mouseover = true;
		this.outline.visible = true;
		this.name_text.setColor("#45BF55");
		this.shadow = null;
	}.bind(this));

	this.addEventListener("rollout", function(event){
		this.mouseover = false;
		this.outline.visible = false;
		this.outline.filters = null;
		this.outline.uncache();
		this.name_text.setColor(this.name_text_color);
		this.shadow = new createjs.Shadow("#333",3,3,10);
	}.bind(this));
}

NPC.prototype.tick = function(){
	if(this.mouseover){
		this.outline.uncache();
		this.outline.filters = [new createjs.ColorFilter(0,0,0,1,69,191,85,0)];
		this.outline.cache(-12,-16,24,32);
	}
}

NPC.prototype.interaction = function(target){
	console.log("target");
}