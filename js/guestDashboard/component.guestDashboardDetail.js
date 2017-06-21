angular.module('app').component('guestDashboardDetail', {
	//NOTE: nothing to bind to at this time.
	controller: ['$scope', '$http', '$state', '$stateParams', '$mdToast', 'Database', 'Session', 
	function ($scope, $http, $state, $stateParams, $mdToast, Database, Session) {
		var that = this;

		this.food = [],
		this.types = [],
		this.foodList = [];

		$scope.oneAtATime = true;

		this.$onInit = function () {

			/* SELECTED COOK SELECTED COOK SELECTED COOK SELECTED COOK */
			var cookUserId = $stateParams['cookUserId'];

			//Get the food for the selected cook
			Session.Collections.cooksFood.forEach(function (foodItem, index) {
				that.food.push(foodItem);
			});

			//We need distinct types to display on the food in separate sections.
			that.unfilteredTypes = selectDistinct(that.food, "type");
			that.unfilteredTypes.forEach(
				function (item, index) {
					that.types.push({ type: item.type });
				}
			);

			//For each food type, add the food type, the list of items related to that type and an
			//indication determining whether the typed list is open or closed (groupOpen).
			that.types.forEach(function (type, index) {
				var foodItem = [];
				that.food.forEach(function (food, ndx) {
					if (type.type === food.type) {
						foodItem.push(food);
					}
				});
				if (that.foodList.length === 0) {
					that.foodList.push({ type: type.type, items: foodItem, groupOpen: true });
				} else {
					that.foodList.push({ type: type.type, items: foodItem, groupOpen: false });
				}
	
			});

		};

		//On the food tab, toggle each section as open or closed
		this.toggleOpen = function (foodListItem) {
			that.foodList.forEach(function (foodObj, index) {				
				if (foodListItem.type === foodObj.type && foodListItem.groupOpen === true) {
					foodObj.groupOpen = false;
				} else {
					if (foodListItem.type === foodObj.type) {
						foodObj.groupOpen = true; 
					} else {
						foodObj.groupOpen = false;
					}
				}
			});
		};
	}],
	templateUrl: 'partials/guestDashboard/guestDashboardDetail.html'
});