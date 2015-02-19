var Home = (function(){

	var instance;

	function init(user_builder, unit_builder_array){
		var user = new User(user_builder);
		var units = [];
		unit_builder_array.forEach(function(unit_builder){
			units.push(new Hero(unit_builder));
		});

		console.log(units);

		var home_stage = new Home_Stage();

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
		getInstance:function(user_builder, unit_builder_array){
			if(!instance){
				instance = init(user_builder, unit_builder_array);
			}
			return instance;
		}
	}
})();