var Home = (function(){

	var instance;

	function init(){
		var home_stage;

		initStage();

		window.onresize = function(){
			home_stage.canvas.width = window.innerWidth;
			home_stage.canvas.height = window.innerHeight;
			home_stage.resize();
			home_stage.update();
		};

		function initStage(){
			home_stage = new Home_Stage();
		}
	}

	return {
		getInstance:function(){
			if(!instance){
				instance = init();
			}
			return instance;
		}
	}
})();

Home.getInstance();