var Home = (function(){

	var instance;

	function init(user_builder){
		var user = new User(user_builder);
		var home_stage = new Home_Stage();

		window.onresize = function(){
			home_stage.canvas.width = window.innerWidth;
			home_stage.canvas.height = window.innerHeight;
			home_stage.resize();
		};

		return {
			getHomeStage:function(){
				return home_stage;
			},
			getUser:function(){
				return user;
			}
		}
	}

	return {
		getInstance:function(user_builder){
			if(!instance){
				instance = init(user_builder);
			}
			return instance;
		}
	}
})();