MapController = {
	loadMap:function(act, chapter, callback){
		MapModel.findOne({act:act,chapter:chapter}).populate("npcs.attribute").exec(function(err, map){
			this.loadMerchantItem(map, callback);
		}.bind(this));
	},
	loadMerchantItem:function(map, callback){
		if(map.merchant){
			ItemController.generateMerchantItem(1, function(err, items){
				map.merchantable_items = items;
				this.loadRecruiterUnit(map, callback);
			}.bind(this));
		}else{
			this.loadRecruiterUnit(map, callback);
		}
	},
	loadRecruiterUnit:function(map, callback){
		if(map.recruiter){
			UnitController.loadRecruitableUnit(function(err, units){
				map.recruitable_units = units;
				callback(map);
			});
		}else{
			callback(map);
		}
	},
}