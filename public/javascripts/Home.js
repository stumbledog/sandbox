var Home = (function(){

	var instance;

	function init(){
	
	}

	return {
		getInstance:function(){
			if(!instance){
				instance = init();
			}
			return instance;
		}
	}
})();

Home.getInstance();