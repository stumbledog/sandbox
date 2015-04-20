function Effect(effect_container, loader){
	this.effect_container = effect_container;
	this.loader = loader;
}

Effect.prototype.play = function(animation, x, y, degree){
	var images = [];
	var frames = [];
	var animation_frame = [];

	/*
	for(key in animation.images){
		images.push(this.loader.getResult(animation.images[key].split('/').pop()));
		frames.push([0,0,animation.width,animation.height,index,animation.regX,animation.regY]);
		animation_frame.push(index);
	}
	*/

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
	//sprite.x = x;
	//sprite.y = y;
	//sprite.rotation = degree + 90;
	sprite.gotoAndPlay("animation");
	sprite.scaleX = sprite.scaleY = animation.scale;
	sprite.addEventListener("animationend", function(event){
		unit.removeChild(sprite);
	}.bind(this));
	unit.addChild(sprite);
}

Effect.prototype.swing = function(x, y, radius, degree){
	var spriteSheet = new createjs.SpriteSheet({
		images:[
			this.loader.getResult("lava_shot_impact1"),
			this.loader.getResult("lava_shot_impact2"),
			this.loader.getResult("lava_shot_impact3"),
			this.loader.getResult("lava_shot_impact4"),
			],
		frames:[
			[0, 0, 163, 167, 0, 81, 167],
			[0, 0, 163, 167, 1, 81, 167],
			[0, 0, 163, 167, 2, 81, 167],
			[0, 0, 163, 167, 3, 81, 167],
			],
		animations:{
			lava_shot:{
				frames:[0,1,2,3],
				speed:0.3,
				next:false
			},
		}
	});

	var sprite = new createjs.Sprite(spriteSheet);
	sprite.x = x;
	sprite.y = y;
	sprite.scaleX = sprite.scaleY = radius / 81;
	sprite.rotation = degree + 90;
	sprite.gotoAndPlay("lava_shot");
	sprite.addEventListener("animationend", function(event){
		this.effect_container.removeChild(sprite);
	}.bind(this));
	this.effect_container.addChild(sprite);
}

Effect.prototype.impact = function(x, y, radius){
	var spriteSheet = new createjs.SpriteSheet({
		images:[
			this.loader.getResult("orange_impx_0"),
			this.loader.getResult("orange_impx_1"),
			this.loader.getResult("orange_impx_2"),
			],
		frames:[
			[0, 0, 160, 160, 0, 80, 80],
			[0, 0, 160, 160, 1, 80, 80],
			[0, 0, 160, 160, 2, 80, 80],
			],
		animations:{
			lava_shot:{
				frames:[0,1,2],
				speed:0.3,
				next:false
			},
		}
	});

	var sprite = new createjs.Sprite(spriteSheet);
	sprite.x = x;
	sprite.y = y;
	sprite.scaleX = sprite.scaleY = radius / 80;
	sprite.rotation = degree + 90;
	sprite.gotoAndPlay("lava_shot");
	sprite.addEventListener("animationend", function(event){
		this.effect_container.removeChild(sprite);
	}.bind(this));
	this.effect_container.addChild(sprite);
}