/* Platters Component */
angular.module('app').component('dashboardPlatters', {
	controller: ['$http', '$state', '$stateParams', '$mdToast', 'Session', 'Cook', 'Database', 'PlatterService', 'PlatterItemService', 
		function ($http, $state, $stateParams, $mdToast, Session, Cook, Database, PlatterService, PlatterItemService) {

		var that = this;
		this.platter 		= {};
		this.platters 		= [];
		this.platterItems 	= [];
		this.foodList 		= [];

		this.$onInit = function () {
			//Initialize the PlatterService--get Session.Collections.platters and platterItems
			if (!(PlatterService.isInitiated())) {
				PlatterService.onInit();
			}

			that.platters = PlatterService.platters;
			that.platterItems = PlatterService.platterItems;
			that.foodList = PlatterService.foodList;

		};

		this.close = function () {
			PlatterItemService.close();
		};
		this.remove = function (platterItem) {
			var obj = {
				table: 				"platterItems",
				firstFieldName: 	"platterId",
				firstFieldValue: 	platterItem.platter_id,
				secondFieldName: 	"foodId",
				secondFieldValue: 	platterItem.food_id
			};

			Database.delete2(obj)
				.then(function (response) {
					return response;
				});

			that.platterItems.forEach(function (item, index) {
				if (item.platter_id === platterItem.platter_id) {
					if (item.food_id === platterItem.food_id) {
						that.platterItems.splice(index, 1);  //console.log('[that.platterItems.platter_id: (' + item.platter_id + ') ]We want to delete: ' + item.food_name + '[' + index + ']');
					}
				}
			});

			that.platters.forEach(function (platter, index) {
				if (platter.platter_id === platterItem.platter_id) {
					platter.Food.forEach(function (foodItem, ndx) {
						if (foodItem.food_id === platterItem.food_id) {
							platter.Food.splice(ndx, 1); //console.log('[foodItem.food_id: (' + foodItem.food_id + ') ]We want to delete: ' + foodItem.food_name + '[' + ndx + ']');
						}
					});
				}
			});

			var platter = that.platters.find(function () {
				return platterItem.platter_id;
			});

			if (platter.Food !== undefined) {
				platter.Food.forEach(function (platterItem, i) {
					that.foodList.forEach(function (Food, index) { //for each type, ie "Meat", "Starches", etc.
						Food.items.forEach(function (food, ndx) {
							if (platterItem.foodId === food.food_id) {
								Food.items[ndx].isOnPlatter = false;	
							}
						});
					});
				});
			}
		};


		this.addPlatter = function (platter) {

			var Platter = {};

			//Add the form's elements to the insert object.
			for (var key in platter) {
				// skip loop if the property is from prototype
				if (!platter.hasOwnProperty(key)) continue;			
				Platter[key] = platter[key];
			}

			Platter.table = "platters";
			Platter.userId = Session.id;
			Platter.menuId = 0;
			Platter.status = 1;
			Platter.lastUpdate = Date.now();
			Platter.id = undefined;

			var cook = new Cook();
			//Add the platter
			cook.addPlatter(Platter)
				.then(function (response) {
					//Get the newly added platter id by using the lastUpdate value
					Database.select({ fields: "lastUpdate", table: "platters", where: Platter.lastUpdate })
						.then(function (response) {
							if ( response.data.data !== undefined && response.data.data.length > 0 ) {
								var platterRecord = response.data.data[0];
								Platter.platter_name = platterRecord.name;
								Platter.platter_id = platterRecord.id;
								Platter.id = platterRecord.id;
								Platter.price = platterRecord.price;
								Platter.cook_id = platterRecord.userId;
								Platter.status = platterRecord.status;
								that.platters.push(Platter);
							} else {
								console.log("Insert or Select Failed.");
							}

							for (var index = 0; index < that.platters.length; index++) {
								if (that.platters[index].id === Platter.id) {
									var a = that.platters.splice(index,1);	// removes the item
									that.platters.unshift(a[0]);			// adds it back to the beginning
									break;
								}
							}

						});

				}); //.then(function (response) {  --> from cook.addPlatter(Platter)

		}; //this.addPlatter


		this.add = function (foodItem) {
			foodItem.food_name = foodItem.name;
			foodItem.platter_id = PlatterService.platter.platter_id;

			PlatterService.platter.Food.push(foodItem);

			//Add the food item to the DB
			PlatterItemService.add(foodItem);

			PlatterService.isOnPlatter();
		};

		this.addFoodItemToPlatter = function (platter) {
			if (platter) {

				if (platter.Food === undefined) {
					platter.Food = [];
				}

				if (platter.Food !== undefined) {
					platter.Food.forEach(function (platterItem, i) {
						that.foodList.forEach(function (Food, index) { //for each type, ie "Meat", "Starches", etc.
							Food.items.forEach(function (food, ndx) {
								if (platterItem.foodId === food.food_id) {
									Food.items[ndx].isOnPlatter = true;	
								}
							});
						});
					});

					PlatterService.platter = platter;
				}
			}
		};

		this.onDelete = function (platter) {
			that.deletePlatter(platter);
			that.deletePlatterItems(platter);
			that.deletePlatterItemsFromArray(platter);
		};
		this.deletePlatter = function (platter) {
			//Remove platter from db.platters where platterId = platter.id
			var obj = {
				table: "platters",
				fieldName: "id",
				fieldValue: platter.platter_id
			};
			Database.delete(obj)
				.then(function (response) {
					return response;
				});
		};
		this.deletePlatterItems = function (platter) {
			//Remove platterItems from db.platterItems where platterId = platter.id
			var obj = {
				table: "platterItems",
				fieldName: "platterId",
				fieldValue: platter.platter_id
			};
			Database.delete(obj)
				.then(function (response) {
					return response;
				});
		};
		this.deletePlatterItemsFromArray = function (platter) {
			var index = that.platters.indexOf(platter);
			that.platters.splice(index, 1);
		};






	}],
	templateUrl: 'partials/dashboard/dashboard.platters.html'
});