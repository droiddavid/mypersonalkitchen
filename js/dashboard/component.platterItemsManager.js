/* Platters Component */
angular.module('app').component('platterItemsManager', {
	controller: [
		'$http', '$state', '$stateParams', '$mdToast', 'Session', 
		'Cook', 'Database', 'PlatterService', 'PlatterItemService', 
		function ($http, $state, $stateParams, $mdToast, Session, 
			Cook, Database, PlatterService, PlatterItemService) {


		var that = this;


		this.platter = {},
		this.foodList = [];
		this.food = undefined;
		this.unfilteredTypes = undefined;
		this.types = undefined;

		this.$onInit = function () {
			//Reference the current platter.  Has Food -- that.platter.Food[]
			that.platter = $stateParams['platter'];

			//We need distinct types to display on each tab.
			that.unfilteredTypes = selectDistinct(Session.Collections.food, "type");
			that.types = [];
			that.unfilteredTypes.forEach(
				function (item, index) {
					that.types.push({ type: item.type });
				}
			);
			that.types.forEach(function (type, index) {
				var foodItem = [];
				Session.Collections.food.forEach(function (food, ndx) {
					if (type.type === food.type) {
						foodItem.push(food);
					}
				});
				that.foodList.push({ type: type.type, items: foodItem });
			});

			that.isOnPlatter();
		};

		this.isOnPlatter = function () {
			that.platter.Food.forEach(function (platterItem, i) {				
				that.foodList.forEach(function (Food, index) { //for each type, ie "Meat", "Starches", etc.
					Food.items.forEach(function (food, ndx) {

						if (platterItem.foodId === food.food_id) {
							Food.items[ndx].isOnPlatter = true;	
						}

					});
				});
			});
		};

		this.add = function (foodItem) {
			foodItem.food_name = foodItem.name;
			foodItem.platter_id = that.platter.platter_id;

			that.platter.Food.push(foodItem);

			PlatterService.platter = that.platter;
			PlatterService.updatePlatter(foodItem);

			PlatterItemService.add(foodItem);

			that.isOnPlatter();
		};

		this.close = function () {
			PlatterItemService.close();
		};

		this.remove = function (foodItem) {

			that.platter.Food.forEach(function (platterItem, i) {
				if (foodItem.type === platterItem.type) {
					if (foodItem.food_id === platterItem.food_id) {
						that.platter.Food.splice(i, 1);
					}
				}

			});



			that.platter.Food.forEach(function (platterItem, i) {

				that.foodList.forEach(function (Food, index) { //for each type, ie "Meat", "Starches", etc.

					if (foodItem.type === Food.type) {

						Food.items.forEach(function (food, ndx) {

							//Food.items[ndx].isOnPlatter = (platterItem.foodId === food.food_id) ? true : false; 

							var p = platterItem.foodId;
							var f = food.food_id;
							debugger;

							if (platterItem.foodId === food.food_id) {
								// Food.items.splice(ndx, 1);
								Food.items[ndx].isOnPlatter = false;
							}

						});

					}

				});

			});
			




			//PlatterItemService.remove(foodItem);
		};

	}]




	,
	templateUrl: 'partials/dashboard/platterItemsManager.html'
});