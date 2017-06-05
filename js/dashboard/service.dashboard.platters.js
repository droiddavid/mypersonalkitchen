/* js/dashboard/service.dashboard.platters.js */
angular.module('app').service('PlatterService', [
	'$http', '$state', '$stateParams', '$mdToast', 'Session', 'Cook', 'Database',
	function ($http, $state, $stateParams, $mdToast, Session, Cook, Database) {

	var that = this;

	this.platter = {
		Food: []
	}; 							//is a singe platter
	this.platters = []; 		//is a list of platters
	this.platterItems = []; 	//is a list of platterItems
	this.obj = {};

	this.foodList = [];
	this.unfilteredTypes = undefined;
	this.types = undefined;

	this.initiated = false;


	this.onInit = function () {

		if (!that.initiated) {

			that.platters.length = 0;
			that.platterItems.length = 0;

			Session.Collections.platters.forEach(function (platter, index) {
				that.platters.push(JSON.parse(JSON.stringify(platter)));
			});

			Session.Collections.platterItems.forEach(function (platterItem, index) {
				that.platterItems.push(JSON.parse(JSON.stringify(platterItem)));
			});

			//For each platter, if a platterItem exist, add it to the platter's Food array.
			that.platters.forEach(function (platter, index) {
				if (platter.Food === undefined) {
					platter.Food = [];
				}
				that.platterItems.forEach(function (platterItem, ndx) {
					if (platterItem.food_id !== null) {
						if (platter.platter_id === platterItem.platter_id) {
							platter.Food.push(platterItem);
						}					
					}
				});
			});






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

			that.initiated = true;		

		} //if
	
	}; //this.onInit


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


	this.isInitiated = function () {
		return that.initiated;
	};

	this.getData = function (obj) {
		Database.select(obj)
			.then(function (response) {
				return response.data.data;
			});
	};

	this.getPlatter = function (platterId) {
		return that.platter;
	};

	//Get platters by session id
	this.getPlatters = function () {
		return that.platters;
	};

	this.getPlatterItem = function (id) {
		return that.platterItems[id];
	};

	this.getPlatterItems = function (platterId) {
		
		that.obj.table 	= 'platterItems';
		that.obj.fields = 'platterId';
		that.obj.where 	= platterId;

		return Database.select(that.obj);

	};

	this.add = function (platter) { //***********TOBED

		//Build the insert object.
		that.obj.userId = Session.id;
		obj.table 		= "platterItems";

		//Insert the object into the db.
		Database.insert(obj)
			.then(function (response) {
				if (response) { //////****************************CHANGE FROM STATUSTEXT AS THAT MIGHT APPEAR EVEN IF THE OPERATION FAILED.
					var retVal = (response.statusText === "OK") ? "Registration Successful" : "Registration Failed";
					return retVal;
				}
			});

			//inform the user that the food item is on the platter
			// $mdToast.show(
			// 	$mdToast.simple()
			// 	.textContent(foodItem.name + ' added.')                       
			// 	.hideDelay(3000)
			// );
	};

	this.remove = function (platter) {
		var i = undefined;

		//find the index of the item to be removed.
		platter.Food.forEach(function (item, index) {
			var x = item;

			// if (item.foodId === foodItem.food_id) {
			// 	i = index;
			// }
		});

		// //
		// that.foodList.forEach(function (item, index) {
		// 	that.platter.Food.forEach(function (foodItem) {
		// 		if (item.food_id === foodItem.food_id) {
		// 			//debugger;
		// 			item.isOnPlatter = false;
		// 		}
		// 	});
		// });

		// that.platter.Food.splice(i, 1);

		// var obj = {
		// 	table: 				"platterItems",
		// 	firstFieldName: 	"platterId",
		// 	firstFieldValue: 	that.platter.id,
		// 	secondFieldName: 	"foodId",
		// 	secondFieldValue: 	foodItem.food_id
		// };

		// //debugger;

		// Database.delete2(obj)
		// 	.then(function (response) {
		// 		return response;
		// 	});

	};

	this.close = function () {};

	
}]);