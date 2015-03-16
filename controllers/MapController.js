MapController = {
	loadMap:function(level, act, chapter, callback){
		MapModel.findOne({act:act,chapter:chapter}).populate("npcs.attribute").exec(function(err, map){
			this.loadMerchantItem(level, map, callback);
		}.bind(this));
	},
	loadMerchantItem:function(level, map, callback){
		if(map.merchant){
			ItemController.generateMerchantItem(level, function(err, items){
				map.merchantable_items = items;
				this.loadRecruiterUnit(level, map, callback);
			}.bind(this));
		}else{
			this.loadRecruiterUnit(level, map, callback);
		}
	},
	loadRecruiterUnit:function(level, map, callback){
		if(map.recruiter){
			UnitController.loadRecruitableUnit(level, function(err, units){
				map.recruitable_units = units;
				callback(map);
			});
		}else{
			callback(map);
		}
	},
}