function RecruiterStore(units){
	this.recruiterstore_initialize(units);
}

RecruiterStore.prototype = Object.create(Store.prototype);
RecruiterStore.prototype.constructor = RecruiterStore;

RecruiterStore.prototype.recruiterstore_initialize = function(units){
	this.store_initialize(units);
	console.log(units);
	console.log(this.items);
	//this.setCategory();
	//this.setItems();

	//this.current_key = null;
	this.render();
}
