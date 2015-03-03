ItemController = {
	loadMerchantItem:function(callback){
		PrototypeWeaponModel.find({merchantable:true}, callback);
	}
}