function MessageStage(){
	this.initialize();
}

createjs.extend(MessageStage, createjs.Stage);
MessageStage = createjs.promote(MessageStage, "Stage");

MessageStage.prototype.initialize = function(){
	this.canvas = document.getElementById("message");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.Stage_constructor(this.canvas);
}

MessageStage.prototype.displayMessage = function(animation, text, font_size, color, width, border_color, duration, x, y){
	this.canvas.style.zIndex = 10;
	var message = new OutlineText(text, font_size+"px Arial", color, border_color, width);
	message.textAlign("center");
	message.textBaseline("middle");

	this.addChild(message);
	
	switch(animation){
		case "left_to_right":
			message.x = -message.getMeasuredWidth();
			message.y = this.canvas.height/2 + y;
			createjs.Tween.get(message).to({x:this.canvas.width/2 + x},300)
			.wait(duration)
			.to({x:this.canvas.width},300).call(function(){
				this.removeChild(message);
				this.canvas.style.zIndex = -1;
			}.bind(this));
			break;
	}
}