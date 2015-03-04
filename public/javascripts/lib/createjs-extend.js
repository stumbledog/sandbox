function OutlineText(text, style, color, outline_color, outline_width){
	this.initialize(text, style, color, outline_color, outline_width);
}

createjs.extend(OutlineText, createjs.Container);
OutlineText = createjs.promote(OutlineText, "Container");

OutlineText.prototype.initialize = function(text, style, color, outline_color, outline_width){
	this.Container_constructor();
	this.text = new createjs.Text(text, style, color);
	this.outline = this.text.clone();
	this.outline.color = outline_color;
	this.outline.outline = outline_width;
	this.addChild(this.outline, this.text);
}

OutlineText.prototype.getMeasuredWidth = function(){
	return this.outline.getMeasuredWidth();
}

OutlineText.prototype.textAlign = function(textAlign){
	this.text.textAlign = textAlign;
	this.outline.textAlign = textAlign;
}

OutlineText.prototype.textBaseline = function(textBaseline){
	this.text.textBaseline = textBaseline;
	this.outline.textBaseline = textBaseline;
}

OutlineText.prototype.setText = function(text){
	this.text.text = text;
	this.outline.text = text;
}

OutlineText.prototype.setAlpha = function(alpha){
	this.text.alpha = alpha;
	this.outline.alpha = alpha;
}

OutlineText.prototype.setColor = function(color){
	this.text.color = color;
}

function Button(text, button){
	this.initialize(text, button);
}

createjs.extend(Button, createjs.Container);
Button = createjs.promote(Button, "Container");

Button.prototype.initialize = function(text, button){
	this.Container_constructor();
	this.text = new createjs.Text(text.text, text.style, text.color);
	this.text.x = 10;
	this.text.y = 10;
	this.button = new createjs.Shape();
	this.button.graphics.s(button.border_color).ss(button.border_width).f(button.background).rr(0, 0, this.text.getMeasuredWidth() + button.padding * 2, this.text.getMeasuredHeight() + button.padding * 2, 5);
	this.addChild(this.button);

	if(text.outline){
		this.outline = this.text.clone();
		this.outline.color = text.outline.color;
		this.outline.outline = text.outline.width;
		this.addChild(this.outline);
	}
	this.addChild(this.text);
}