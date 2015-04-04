function RecruiterStore(items){
	this.recruiterstore_initialize(items);
}

RecruiterStore.prototype = Object.create(Store.prototype);
RecruiterStore.prototype.constructor = RecruiterStore;

RecruiterStore.prototype.recruiterstore_initialize = function(items){
	this.store_initialize(items);
	//this.setCategory();
	//this.setItems();

	//this.current_key = null;
	this.render();
}
