UnitController = {
	createUnit:function(unit_builder, callback){
		var unit = new UnitModel(unit_builder);
		unit.save(function(){
			console.log("unit created");
			console.log(unit);
			callback(unit);
		});
	},
	loadUnitByUser:function(user_id, callback){

	}
}