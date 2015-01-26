init();
var bottomStage, topStage;
	function init() {
		bottomStage = stageSetup("one", handleEvt);
		bottomStage.name = "bottomStage";
		//bottomStage.enableDOMEvents(false);	// you can set this if the bottom stage is completely covered by the top stage, to reduce the number of active event listeners.
		topStage = stageSetup("two", handleEvt);
		topStage.name = "topStage";
		topStage.enableMouseOver();
		topStage.nextStage = bottomStage;
		bottomStage.enableMouseOver();
		bottomStage.addChild(makeSquare(30, 95, "red", handleEvt));
		topStage.addChild(makeSquare(375, 30, "#0F0", handleEvt));
		// text object to output the
		bottomStage.text = bottomStage.addChild(new createjs.Text("", "15px monospace", "#111")).set({x: 195, y: 30, lineHeight: 16.7});
		topStage.text = topStage.addChild(new createjs.Text("", "15px monospace", "#111")).set({x: 30, y: 30, lineHeight: 16.7});
	}
	/* create a stage object to work with the canvas
	 add event listeners for stage events
	 start tick on stage
	 */
	function stageSetup(canvasName, handler) {
		stage = new createjs.Stage(canvasName);
		//stage.addEventListener("stagemousemove", handler);	// too noisy
		stage.addEventListener("stagemousedown", handler);
		stage.addEventListener("stagemouseup", handler);
		stage.addEventListener("mouseleave", handler);
		stage.addEventListener("mouseenter", handler);
		createjs.Ticker.addEventListener("tick", stage);
		stage.log = [];
		return stage;
	}
	/* create a container with a shape that reports mouse events to handler */
	function makeSquare(x, y, color, handler) {
		var container = new createjs.Container().set({name: "container"});
		var shape = container.addChild(new createjs.Shape()).set({name: "square", x: x, y: y});
		shape.graphics.beginFill(color).drawRect(0, 0, 135, 135);
		container.addEventListener("mouseover", handler);
		container.addEventListener("mouseout", handler);
		container.addEventListener("dblclick", handler);
		container.addEventListener("click", handler);
		container.cursor = "pointer";
		return container;
	}
	// log functions that update text object on related stages with mouse event info
	function handleEvt(evt) {
		var target = evt.target, stage = target.getStage(), log = stage.log;
		log.push(evt.type + " on " + target.name + " x:" + evt.stageX.toFixed(0) + " y:" + evt.stageY.toFixed(0));
		while (log.length > 12) {
			log.shift();
		}
		stage.text.text = log.join("\n");
		if (evt.type == "mouseover") {
			target.alpha = 0.5;
		}
		if (evt.type == "mouseout") {
			target.alpha = 1;
		}
	}