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
	this.platterItems = []; 	//is a list of platterItems
	this.food = []; 			//is a list of foodItems
	this.initialized = false;


	this.init = function () {
		if (!that.initialized) {
			that.getPlatters();
		}
		that.initialized = true;
	};
	this.getData = function (table) {
		return Database.select({
				"table": table,
				"fields": "userId",
				"where": Session.id
			})		
	};
	this.getPlatters = function () {
		that.getData("platters")
			.then(function (response) {
				if (response && response.data && response.data.data) {
					that.platters = response.data.data;
					that.getPlatterItems();
				}
			});
	};
	this.getPlatterItems = function () {
		that.getData("platterItems")
			.then(function (response) {
				if (response && response.data && response.data.data) {
					that.platterItems = response.data.data;
					that.getFood();
				}
			});
	};
	this.getFood = function () {
		if (FoodService.initialized) {
			that.food = FoodService.Food;
			that.addFoodToPlatters();
		} else {
			that.getData("food")
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.food = response.data.data;
						that.addFoodToPlatters();
					}
				});
		}
	};
	this.addFoodToPlatters = function () {
		
		that.platters.forEach(function (platter, index) {
			var _platter = platter;

			if (_platter.Food === undefined) {
				_platter.Food = [];
			} else {
				_platter.Food.length = 0;
			}

			that.platterItems.forEach(function (platterItems, ndx) {
				var _platterItems = platterItems;

				if (_platterItems.platterId === _platter.id) {
					that.food.forEach(function (foodItem, i) {
						var _foodItem = foodItem;

						if (_platterItems.foodId === _foodItem.id) {
							_platter.Food.push(_foodItem);
						}
					});
				}

			});
		});
	};
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



	this.updatePlatter = function (platter) {
		var _platter = that.platters.find(function (p) {
			return p.id === platter.id
		});
		debugger;
		_platter = platter;
	};




	this.removeFoodItemFromDB = function (platter, foodItem) {
		var _platter = platter;

		var obj = {
			table: 				"platterItems",
			firstFieldName: 	"platterId",
			firstFieldValue: 	platter.id,
			secondFieldName: 	"foodId",
			secondFieldValue: 	foodItem.id
		};

		//Remove from the database
		return Database.delete2(obj);
	}
	this.removeFoodItem = function (platter, foodItem) {
		var platter_index = undefined,
			_platter = undefined,
			platter_Food_index = undefined;

		//Remove the record from the platterItems DB
		that.removeFoodItemFromDB(platter, foodItem)
			.then(function (response) {
				return response;
			});


		/*	1. Get the platter's index in that "this.platters" array
			2. Set a local variable for the Service's matching 
				platter (i.e. matches the 'platter' argument) */
		for (var i=0; i<that.platters.length; i++) {
			if (that.platters[i].id === platter.id) {
				platter_index = i;
				_platter = that.platters[i];
			}
		}

		//Get the index of the food item on the current platter, i.e. '_platter.Food[x]'
		for (var n=0; n<_platter.Food.length; n++) {
			var _foodItem = _platter.Food[n];

			if (_platter.Food[n].id === foodItem.id) {
				platter_Food_index = n;
			}
		}

		//Remove the platter from the _platter.Food array.
		_platter.Food.splice(platter_Food_index, 1);

	};
	this.isInitialized = function () {
		return that.initialized;
	};
}]);