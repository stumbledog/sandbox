UnitController = {
	createUnit:function(prototype_unit_id, user_id, callback){
		PrototypeUnitModel.findById(prototype_unit_id, '-_id', function(err, prototype_unit){
			var unit = new UnitModel(prototype_unit);
			unit._id = mongoose.Types.ObjectId();
			unit._user = user_id;
			console.log("Create unit");
			unit.save(callback);
		});
	},
	getUnitsByUserId:function(user_id, callback){
		console.log("Load units by user id");
		UnitModel.find({_user:user_id}, callback);
	}
}