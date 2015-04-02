MapController = {
	loadMap:function(level, act, chapter, callback){
		MapModel.findOne({act:act,chapter:chapter}, function(err, map){
			if(map.merchant){
				this.loadMerchantItem(level, map, callback);
			}else if(map.recruiter){
				this.loadRecruiterUnit(level, map, callback);
			}else{
				callback(map);
			}
		}.bind(this));
	},
	loadMerchantItem:function(level, map, callback){
		ItemController.generateMerchantItem(level, function(err, items){
			map.merchantable_items = items;
			if(map.recruiter){
				this.loadRecruiterUnit(level, map, callback);
			}else{
				callback(map);
			}
		}.bind(this));
	},
	loadRecruiterUnit:function(level, map, callback){
		UnitController.loadRecruitableUnit(level, function(err, units){
			map.recruitable_units = units;
			callback(map);
		});
	},
}