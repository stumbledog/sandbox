MapController = {
	loadMap:function(level, act, chapter, callback){
		MapModel.findOne({act:act,chapter:chapter}, function(err, map){

			this.loadMerchantItem(level, map, callback);
			/*
			if(map.merchant){
				this.loadMerchantItem(level, map, callback);
			}else if(map.recruiter){
				this.loadRecruiterUnit(level, map, callback);
			}else{
				callback(map);
			}
			*/
		}.bind(this));
	},
	loadMerchantItem:function(level, map, callback){
		ItemController.generateMerchantItem(level, function(err, items){
			map.merchantable_items = items;
			this.loadWorldMap(map, callback);
			this.loadRecruiterUnit(level, map, callback);
			/*
			if(map.recruiter){
				this.loadRecruiterUnit(level, map, callback);
			}else{
				callback(map);
			}*/
		}.bind(this));
	},
	loadRecruiterUnit:function(level, map, callback){
		UnitController.loadRecruitableUnit(level, function(err, units){
			map.recruitable_units = units;
			this.loadWorldMap(map, callback);
			//callback(map);
		}.bind(this));
	},
	loadWorldMap:function(map, callback){
		MapModel.find({act:{$gt:0}}).select('act chapter name').sort('act chapter').exec(function(err, maps){
			console.log(maps);
			map.world_map = maps;
			callback(map);
		});
	}
}