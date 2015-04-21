function Effect(effect_container, loader){
	this.effect_container = effect_container;
	this.loader = loader;
}

Effect.prototype.play = function(animation, x, y, degree){
	var images = [];
	var frames = [];
	var animation_frame = [];

	animation.images.forEach(function(image, index){
		images.push(this.loader.getResult(image.split('/').pop()));
		frames.push([0,0,animation.width,animation.height,index,animation.regX,animation.regY]);
		animation_frame.push(index);
	},this);

	var spriteSheet = new createjs.SpriteSheet({
		images:images,
		frames:frames,
		animations:{
			animation:{
				frames:animation_frame,
				speed:0.3,
				next:false
			},
		}
	});

	var sprite = new createjs.Sprite(spriteSheet);
	sprite.x = x;
	sprite.y = y;
	sprite.rotation = degree;
	sprite.gotoAndPlay("animation");
	sprite.scaleX = sprite.scaleY = animation.scale;
	sprite.addEventListener("animationend", function(event){
		this.effect_container.removeChild(sprite);
	}.bind(this));
	this.effect_container.addChild(sprite);
}

Effect.prototype.playOnUnit = function(animation, unit){
	var images = [];
	var frames = [];
	var animation_frame = [];
	animation.images.forEach(function(image, index){
		images.push(this.loader.getResult(image.split('/').pop()));
		frames.push([0,0,animation.width,animation.height,index,animation.regX,animation.regY]);
		animation_frame.push(index);
	},this);

	var spriteSheet = new createjs.SpriteSheet({
		images:images,
		frames:frames,
		animations:{
			animation:{
				frames:animation_frame,
				speed:0.3,
				next:false
			},
		}
	});

	var sprite = new createjs.Sprite(spriteSheet);
	sprite.gotoAndPlay("animation");
	sprite.scaleX = sprite.scaleY = animation.scale;
	sprite.addEventListener("animationend", function(event){
		unit.removeChild(sprite);
	}.bind(this));
	unit.addChild(sprite);
}

Effect.prototype.message = function(animation, text, font_size, color, width, border_color, duration, x, y){
	var message = new OutlineText(text, font_size+"px Arial", color, width, border_color);
	message.textAlign("center");
	message.textBaseline("middle");
	this.effect_container.addChild(message);
	switch(animation){
		case "left_to_right":
			message.x = -message.getMeasuredWidth();
			message.y = y;
			createjs.Tween.get(message).to({x:x},300)
			.wait(duration)
			.to({x:2*x},300).call(function(){
				this.effect_container.removeChild(message);
			}.bind(this));
			break;
		case "":
	}
}