/* js/dashboard/service.dashboard.platters.js */
angular.module('app').service('PlatterService', [
	'$http', '$state', '$stateParams', '$rootScope', '$mdToast', 
	'Session', 'Cook', 'Database', 'FoodService',
	function (
		$http, $state, $stateParams, $rootScope, $mdToast, 
		Session, Cook, Database, FoodService) {

	var that = this;

	this.cook = new Cook();
	this.platters = []; 		//is a list of platters
	this.initialized = false;

	this.init = function () {
		if (!that.initialized) {
			that.platters.length = 0;

			Database.select({
				table: "platters",
				fields: "userId",
				where: Session.id
			})
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.platters = response.data.data;
					} //end if response...
				}); //end then chain
		}
		that.initialized = true;
	}; //this.init
	this.isOnPlatter = function () {
		var platter = that.platter;
		that.platter.Food.forEach(function (platterItem, i) {
			that.foodList.forEach(function (Food, index) { //for each type, ie "Meat", "Starches", etc.
				Food.items.forEach(function (food, ndx) {
					if (platterItem.foodId === food.food_id || platterItem.food_id === food.food_id) {
						Food.items[ndx].isOnPlatter = true;	
					}
				});
			});
		});
	};
	this.isInitialized = function () {
		return that.initialized;
	};
}]);