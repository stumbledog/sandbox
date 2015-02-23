MapController = {
	loadMap:function(act, chapter, callback){
		MapModel.findOne({act:act,chapter:chapter}).populate("units.prototype_unit").exec(callback);
	},
	loadUnits:function(req, res, callback){

	}
}