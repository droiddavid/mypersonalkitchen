/* js/services.js */
angular.module('app').service('PlatterItemService', [
	'$http', '$state', '$stateParams', '$rootScope', '$mdToast', 'Session', 'Cook', 'Database', 'PlatterService',
	function ($http, $state, $stateParams, $rootScope, $mdToast, Session, Cook, Database, PlatterService) {

	var that = this;

	this.platterItem = {}; 				//is a singe platter item
	this.platterItems = []; 			//contains food from the platter (platter.Food[])
	this.platter = undefined; 			//the current platter (contains an array of Food)
	this.foodList = undefined; 			//holds a separate copy of Session.Collections.food
	this.initialized = false;
	

	this.init = function () {

		var that = this;

		if (Database) {
			Database.select({
				table: "platterItems",
				fields: "userId",
				where: Session.id
			})
				.then(function (response) {
					if (response && response.data && response.data.data) {
						that.platterItems = response.data.data;
						that.initialized = true;
						$rootScope.$broadcast('PlatterService.loaded');
					}
				});
		}
	};



	// this.onInit = function (platter) {
	// 	if (!that.initialized) {
	// 		that.platter = platter;
	// 		that.platterItems = that.platter.Food;
	// 		that.foodList = [];

	// 		Session.Collections.food.forEach(function (foodItem, index) {
	// 			that.foodList.push(JSON.parse(JSON.stringify(foodItem)));
	// 		});

	// 		//Determine if the food item is already on the platter.
	// 		that.isOnPlatter();

	// 		that.getDBPlatterItems(that.platter.Food);

	// 		that.initialized = true;
	// 	}
	// };
	this.getDBPlatterItems = function (platters) {
		var obj = {
			fields: 	'platterId',
			table: 		'platterItems',
			where: 		that.platter.id
		};
		Database.select(obj)
			.then(function (response) {
				that.dbPlatterItems = response.data.data;
			});
	};

	this.add = function (foodItem) {

		//Build the insert object.
		var obj = {};
		obj.platterId 	= PlatterService.platter.platter_id;
		obj.foodId 		= foodItem.food_id;
		obj.table 		= "platterItems";

		//Insert the object into the db.
		Database.insert(obj)
			.then(function (response) {
				if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
					var retVal = (response.statusText === "OK") ? "Insertion Successful" : "Insertion Failed";
					return retVal;
				}
			});

		//inform the user that the food item is on the platter
		$mdToast.show(
			$mdToast.simple()
			.textContent(foodItem.name + ' added.')                       
			.hideDelay(3000)
		);

	};

	this.remove = function (foodItem) {

		PlatterService.platter.Food.forEach(function (foodItem) {
			debugger;
			var fdItm = foodItem.food_id;

			Session.Collections.food.forEach(function (item, index) {
				debugger;
				var itm_foodId = item.food_id;

					if (item.food_id === foodItem.food_id) {
						item.isOnPlatter = false;
					}

			});			
		});
		var i = undefined;

		//find the index of the item to be removed.
		PlatterService.platter.Food.forEach(function (item, index) {
			if (item.foodId === foodItem.food_id) {
				i = index;
			}
		});

		//PlatterService.platter.Food.splice(i, 1);

		var obj = {
			table: 				"platterItems",
			firstFieldName: 	"platterId",
			firstFieldValue: 	PlatterService.platter.id,
			secondFieldName: 	"foodId",
			secondFieldValue: 	foodItem.food_id
		};

		//debugger;

		// Database.delete2(obj)
		// 	.then(function (response) {
		// 		return response;
		// 	});

	};

	this.close = function () {};

	
}]);