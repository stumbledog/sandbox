MapController = {
	loadBasecamp:function(level, callback){
		MapModel.findOne({act:0,chapter:0}, function(err, map){
			this.loadMerchantItem(level, map, callback);
		}.bind(this));
	},
	loadMerchantItem:function(level, map, callback){
		ItemController.generateMerchantItem(level, function(err, items){
			map.merchantable_items = items;
			this.loadWorldMap(map, callback);
		}.bind(this));
	},
	loadMap:function(level, act, chapter, difficulty_level, callback){
		MapModel.findOne({act:act,chapter:chapter}, function(err, map){
			//map.initMap();
			callback(err, map);
		}.bind(this));
	},
	loadWorldMap:function(map, callback){
		MapModel.find({act:{$gt:0}}).select('act chapter name').sort('act chapter').exec(function(err, maps){
			map.world_map = maps;
			callback(map);
		});
	}
}